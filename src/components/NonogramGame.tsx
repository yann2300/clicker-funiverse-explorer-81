
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Cell = {
  filled: boolean;
  selected: boolean;
};

interface NonogramGameProps {
  isOpen: boolean;
  onClose: () => void;
  onSolve: () => void;
}

const NonogramGame = ({ isOpen, onClose, onSolve }: NonogramGameProps) => {
  // Create a simple 3x3 nonogram puzzle
  // 1 = filled, 0 = empty
  const [puzzle] = useState([
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);
  
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [solved, setSolved] = useState(false);
  
  // Initialize the grid
  useEffect(() => {
    if (isOpen) {
      // Reset the game state when opened
      const initialGrid = Array(3).fill(0).map(() => 
        Array(3).fill(0).map(() => ({ filled: false, selected: false }))
      );
      setGrid(initialGrid);
      setSolved(false);
    }
  }, [isOpen]);
  
  // Calculate row and column hints
  const rowHints = puzzle.map(row => {
    const hints = [];
    let count = 0;
    
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    
    if (count > 0) {
      hints.push(count);
    }
    
    return hints.length ? hints : [0];
  });
  
  const colHints = Array(puzzle[0].length).fill(0).map((_, colIndex) => {
    const hints = [];
    let count = 0;
    
    for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
      if (puzzle[rowIndex][colIndex] === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    
    if (count > 0) {
      hints.push(count);
    }
    
    return hints.length ? hints : [0];
  });
  
  // Toggle cell selection
  const toggleCell = (rowIndex: number, colIndex: number) => {
    if (solved) return;
    
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex].selected = !newGrid[rowIndex][colIndex].selected;
    setGrid(newGrid);
    
    // Check if puzzle is solved
    checkSolution(newGrid);
  };
  
  // Check if the current grid matches the solution
  const checkSolution = (currentGrid: Cell[][]) => {
    for (let rowIndex = 0; rowIndex < puzzle.length; rowIndex++) {
      for (let colIndex = 0; colIndex < puzzle[0].length; colIndex++) {
        // If solution is 1, cell must be selected
        // If solution is 0, cell must not be selected
        if ((puzzle[rowIndex][colIndex] === 1 && !currentGrid[rowIndex][colIndex].selected) ||
            (puzzle[rowIndex][colIndex] === 0 && currentGrid[rowIndex][colIndex].selected)) {
          return;
        }
      }
    }
    
    // If we get here, the puzzle is solved
    setSolved(true);
    setTimeout(() => {
      onSolve();
      onClose();
    }, 1500);
  };
  
  if (!grid.length) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{solved ? "🎉 Puzzle Solved!" : "Solve the Nonogram"}</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex justify-center mb-4">
            <p className="text-sm text-gray-500">Fill in the correct cells to solve the puzzle</p>
          </div>
          
          <div className="flex">
            {/* Empty corner cell */}
            <div className="w-8 h-8"></div>
            
            {/* Column hints */}
            <div className="flex">
              {colHints.map((hints, colIndex) => (
                <div key={`col-${colIndex}`} className="w-8 h-8 flex items-end justify-center pb-1">
                  <div className="text-xs font-bold text-steamgifts-text">{hints.join(',')}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row hints + Grid */}
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {/* Row hint */}
              <div className="w-8 h-8 flex items-center justify-end pr-1">
                <div className="text-xs font-bold text-steamgifts-text">{rowHints[rowIndex].join(',')}</div>
              </div>
              
              {/* Cells */}
              <div className="flex">
                {row.map((cell, colIndex) => (
                  <div 
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`w-8 h-8 border border-gray-300 flex items-center justify-center cursor-pointer ${
                      cell.selected ? 'bg-steamgifts-primary' : 'bg-white hover:bg-gray-100'
                    }`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {solved && (
            <div className="mt-4 text-center text-green-600 font-bold animate-pulse">
              You've solved it! +10,000 points
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NonogramGame;
