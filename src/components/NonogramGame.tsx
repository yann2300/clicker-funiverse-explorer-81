
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

export interface NonogramGameProps {
  onSolve: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NonogramGame = ({ onSolve, isOpen, onClose }: NonogramGameProps) => {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [rows, setRows] = useState<number[][]>([]);
  const [cols, setCols] = useState<number[][]>([]);
  const [size, setSize] = useState(5);
  const [solved, setSolved] = useState(false);

  const generatePuzzle = useCallback((newSize: number) => {
    setSize(newSize);
    setSolved(false);
    
    // Generate a random solution
    const solution: boolean[][] = Array(newSize).fill(null).map(() =>
      Array(newSize).fill(null).map(() => Math.random() > 0.5)
    );
    
    // Calculate row clues
    const rowClues: number[][] = solution.map(row => {
      const clues: number[] = [];
      let currentRun = 0;
      row.forEach(cell => {
        if (cell) {
          currentRun++;
        } else {
          if (currentRun > 0) {
            clues.push(currentRun);
            currentRun = 0;
          }
        }
      });
      if (currentRun > 0) {
        clues.push(currentRun);
      }
      return clues.length === 0 ? [0] : clues;
    });
    
    // Calculate column clues
    const colClues: number[][] = Array(newSize).fill(null).map((_, colIndex) => {
      const clues: number[] = [];
      let currentRun = 0;
      for (let i = 0; i < newSize; i++) {
        if (solution[i][colIndex]) {
          currentRun++;
        } else {
          if (currentRun > 0) {
            clues.push(currentRun);
            currentRun = 0;
          }
        }
      }
      if (currentRun > 0) {
        clues.push(currentRun);
      }
      return clues.length === 0 ? [0] : clues;
    });
    
    // Initialize the grid with all cells empty
    const initialGrid: boolean[][] = Array(newSize).fill(null).map(() =>
      Array(newSize).fill(false)
    );
    
    setGrid(initialGrid);
    setRows(rowClues);
    setCols(colClues);
  }, []);

  useEffect(() => {
    if (isOpen) {
      generatePuzzle(size);
    }
  }, [generatePuzzle, size, isOpen]);

  const toggleCell = (row: number, col: number) => {
    if (solved) return;
    setGrid(prevGrid => {
      const newGrid = prevGrid.map((rowArray, rowIndex) =>
        rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ? !cell : cell)) : rowArray
      );
      return newGrid;
    });
  };

  const checkSolution = () => {
    let isCorrect = true;
    for (let i = 0; i < size; i++) {
      let rowRun = 0;
      let colRun = 0;
      let rowClueIndex = 0;
      let colClueIndex = 0;

      for (let j = 0; j < size; j++) {
        if (grid[i][j]) {
          rowRun++;
        } else {
          if (rowRun > 0) {
            if (rows[i][rowClueIndex] !== rowRun) {
              isCorrect = false;
              break;
            }
            rowClueIndex++;
            rowRun = 0;
          }
        }

        if (grid[j][i]) {
          colRun++;
        } else {
          if (colRun > 0) {
            if (cols[i][colClueIndex] !== colRun) {
              isCorrect = false;
              break;
            }
            colClueIndex++;
            colRun = 0;
          }
        }
      }

      if (rowRun > 0) {
        if (rows[i][rowClueIndex] !== rowRun) {
          isCorrect = false;
          break;
        }
        rowClueIndex++;
      }

      if (colRun > 0) {
        if (cols[i][colClueIndex] !== colRun) {
          isCorrect = false;
          break;
        }
        colClueIndex++;
      }

      if (rowClueIndex !== rows[i].length || colClueIndex !== cols[i].length) {
        isCorrect = false;
        break;
      }

      if (!isCorrect) break;
    }

    if (isCorrect) {
      setSolved(true);
      onSolve();
      onClose();
    } else {
      alert("Incorrect solution. Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4 mb-4">
        <Button onClick={() => generatePuzzle(5)}>5x5</Button>
        <Button onClick={() => generatePuzzle(10)}>10x10</Button>
        <Button onClick={() => generatePuzzle(15)}>15x15</Button>
      </div>
      
      <div className="flex">
        {/* Column Clues */}
        <div className="mr-2">
          {cols.map((col, index) => (
            <div key={`colClue-${index}`} className="flex flex-col items-end h-full justify-end">
              {col.map((clue, i) => (
                <span key={`colClue-${index}-${i}`} className="text-xs text-gray-700">{clue}</span>
              ))}
            </div>
          ))}
        </div>
        
        {/* Grid */}
        <div>
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`w-6 h-6 border border-gray-300 cursor-pointer flex items-center justify-center ${cell ? 'bg-gray-800' : 'bg-white'}`}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                >
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Row Clues */}
        <div className="ml-2">
          {rows.map((row, index) => (
            <div key={`rowClue-${index}`} className="flex items-center h-6">
              {row.map((clue, i) => (
                <span key={`rowClue-${index}-${i}`} className="text-xs text-gray-700 mr-1">{clue}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={checkSolution} disabled={solved} className="mt-4">
        {solved ? "Solved!" : "Check Solution"}
      </Button>
    </div>
  );
};

export default NonogramGame;
