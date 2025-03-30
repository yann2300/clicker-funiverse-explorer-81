
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface NonogramGameProps {
  isOpen: boolean;
  onClose: () => void;
  onSolve: () => void;
}

const NonogramGame: React.FC<NonogramGameProps> = ({ onSolve }) => {
  // Use dummy isOpen and onClose props that aren't used in the implementation
  // but are needed for the type definition
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [solved, setSolved] = useState(false);
  const size = 5; // 5x5 grid for simplicity
  
  // Initialize the grid with a simple pattern
  useEffect(() => {
    const pattern = [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1]
    ];
    
    // Start with an empty player grid
    const newGrid = Array(size).fill(0).map(() => Array(size).fill(0));
    setGrid(newGrid);
  }, []);
  
  // Toggle a cell
  const toggleCell = (row: number, col: number) => {
    if (solved) return;
    
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[row] = [...prev[row]];
      newGrid[row][col] = newGrid[row][col] === 0 ? 1 : 0;
      
      // Check if solved
      setTimeout(checkSolution, 100);
      
      return newGrid;
    });
  };
  
  // Check if the puzzle is solved
  const checkSolution = () => {
    // Hard-coded solution for this simple nonogram
    const solution = [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1]
    ];
    
    const isSolved = grid.every((row, rowIndex) => 
      row.every((cell, colIndex) => cell === solution[rowIndex][colIndex])
    );
    
    if (isSolved) {
      setSolved(true);
      setTimeout(() => {
        onSolve();
      }, 1000);
    }
  };
  
  // Generate row hints
  const getRowHints = (row: number) => {
    const solution = [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1]
    ];
    
    const rowData = solution[row];
    const hints = [];
    let count = 0;
    
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i] === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    
    if (count > 0) {
      hints.push(count);
    }
    
    return hints.length > 0 ? hints.join(' ') : '0';
  };
  
  // Generate column hints
  const getColHints = (col: number) => {
    const solution = [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1]
    ];
    
    const hints = [];
    let count = 0;
    
    for (let i = 0; i < size; i++) {
      if (solution[i][col] === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    
    if (count > 0) {
      hints.push(count);
    }
    
    return hints.length > 0 ? hints.join(' ') : '0';
  };
  
  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Fill in the grid according to the clues to reveal the pattern.
        </p>
        {solved && (
          <p className="text-green-600 font-bold animate-pulse">
            Puzzle solved! +10,000 points
          </p>
        )}
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-rows-6 grid-cols-6 gap-1">
          {/* Empty top-left cell */}
          <div className="w-8 h-8"></div>
          
          {/* Column hints */}
          {Array(size).fill(0).map((_, col) => (
            <div key={`col-${col}`} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-xs font-mono">
              {getColHints(col)}
            </div>
          ))}
          
          {/* Row hints and grid */}
          {Array(size).fill(0).map((_, row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row hint */}
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-xs font-mono">
                {getRowHints(row)}
              </div>
              
              {/* Grid cells */}
              {Array(size).fill(0).map((_, col) => (
                <div 
                  key={`${row}-${col}`}
                  onClick={() => toggleCell(row, col)}
                  className={`w-8 h-8 border cursor-pointer ${
                    grid[row]?.[col] === 1 ? 'bg-black' : 'bg-white'
                  } ${
                    selectedCell?.row === row && selectedCell?.col === col 
                      ? 'ring-2 ring-blue-500' 
                      : ''
                  }`}
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={() => {
            setGrid(Array(size).fill(0).map(() => Array(size).fill(0)));
            setSolved(false);
          }}
          disabled={solved}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default NonogramGame;
