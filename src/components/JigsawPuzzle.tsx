
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Puzzle } from 'lucide-react';
import { fabric } from 'fabric';

interface JigsawPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
  onSolve: () => void;
}

interface JigsawPiece {
  id: number;
  fabricObject: fabric.Object;
  correctPosition: { left: number; top: number };
  currentPosition: { left: number; top: number };
  row: number;
  col: number;
}

const JigsawPuzzle = ({ isOpen, onClose, onSolve }: JigsawPuzzleProps) => {
  const [pieces, setPieces] = useState<JigsawPiece[]>([]);
  const [solved, setSolved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleSize = 400; // Increased size
  const gridSize = 3;
  const pieceSize = puzzleSize / gridSize;
  const snapThreshold = 20; // Distance in pixels for snapping
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Initialize fabric canvas
  useEffect(() => {
    if (isOpen && canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: puzzleSize,
        height: puzzleSize,
        selection: false,
        backgroundColor: '#f0f0f0'
      });
      
      setCanvas(fabricCanvas);
      
      // Clean up
      return () => {
        fabricCanvas.dispose();
        setCanvas(null);
      };
    }
  }, [isOpen, canvas]);

  // Create jigsaw pieces
  useEffect(() => {
    if (isOpen && canvas && !loaded) {
      // Clear any existing pieces
      canvas.clear();
      setPieces([]);
      
      const newPieces: JigsawPiece[] = [];
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688'];
      
      // Create the jigsaw pieces (3x3 grid)
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const id = row * gridSize + col;
          
          // Calculate correct position on grid
          const correctLeft = col * pieceSize;
          const correctTop = row * pieceSize;
          
          // Random initial position (but avoid edges)
          const randomLeft = Math.random() * (puzzleSize - pieceSize - 20) + 10;
          const randomTop = Math.random() * (puzzleSize - pieceSize - 20) + 10;
          
          // Create a fabric rectangle for each piece
          const colorIndex = (row * gridSize + col) % colors.length;
          const rect = new fabric.Rect({
            left: randomLeft,
            top: randomTop,
            width: pieceSize - 4, // Small gap between pieces
            height: pieceSize - 4,
            fill: colors[colorIndex],
            hasControls: false,
            hasBorders: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            cornerSize: 10,
            transparentCorners: false,
            stroke: '#fff',
            strokeWidth: 2,
            shadow: new fabric.Shadow({
              color: 'rgba(0,0,0,0.3)',
              blur: 5,
              offsetX: 2,
              offsetY: 2
            })
          });
          
          // Add text to identify the piece
          const text = new fabric.Text(`${row+1},${col+1}`, {
            left: randomLeft + pieceSize / 2 - 15,
            top: randomTop + pieceSize / 2 - 10,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'white',
            selectable: false,
            evented: false
          });
          
          // Create and store piece data
          const piece: JigsawPiece = {
            id,
            fabricObject: rect,
            correctPosition: { left: correctLeft, top: correctTop },
            currentPosition: { left: randomLeft, top: randomTop },
            row,
            col
          };
          
          newPieces.push(piece);
          
          // Add piece to canvas
          canvas.add(rect);
          canvas.add(text);
          
          // Group piece and text together
          rect.on('moving', function() {
            text.set({
              left: rect.left! + pieceSize / 2 - 15,
              top: rect.top! + pieceSize / 2 - 10
            });
            canvas.renderAll();
          });
        }
      }
      
      // Once all pieces are created, set up the pieces state and event handlers
      setPieces(newPieces);
      setLoaded(true);
      setSolved(false);
      
      // Set up drag and drop handlers
      canvas.on('object:moving', handlePieceMoving);
      canvas.on('object:modified', checkSolution);
      
      canvas.renderAll();
    }
  }, [isOpen, canvas, loaded, pieceSize, gridSize, puzzleSize]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setLoaded(false);
      setPieces([]);
      setSolved(false);
      
      if (canvas) {
        canvas.clear();
        canvas.off('object:moving');
        canvas.off('object:modified');
      }
    }
  }, [isOpen, canvas]);

  // Handle piece moving
  const handlePieceMoving = (e: fabric.IEvent) => {
    if (!e.target) return;
    
    const movingPiece = pieces.find(
      p => p.fabricObject === e.target
    );
    
    if (!movingPiece) return;
    
    // Check if piece is near its correct position for snapping
    const currentLeft = e.target.left || 0;
    const currentTop = e.target.top || 0;
    const correctLeft = movingPiece.correctPosition.left;
    const correctTop = movingPiece.correctPosition.top;
    
    // Snap to position if close enough
    if (
      Math.abs(currentLeft - correctLeft) < snapThreshold && 
      Math.abs(currentTop - correctTop) < snapThreshold
    ) {
      e.target.set({
        left: correctLeft,
        top: correctTop
      });
      
      // Make it slightly different color to indicate correct placement
      e.target.set('stroke', '#0d9');
      
      // Update piece position
      setPieces(prev => 
        prev.map(p => 
          p.id === movingPiece.id 
            ? {
                ...p,
                currentPosition: { left: correctLeft, top: correctTop }
              }
            : p
        )
      );
    } else {
      // Reset stroke color when not in correct position
      e.target.set('stroke', '#fff');
      
      // Update current position
      if (e.target.left !== undefined && e.target.top !== undefined) {
        setPieces(prev => 
          prev.map(p => 
            p.id === movingPiece.id 
              ? {
                  ...p,
                  currentPosition: { left: e.target!.left || 0, top: e.target!.top || 0 }
                }
              : p
          )
        );
      }
    }
    
    canvas?.renderAll();
  };

  // Check if puzzle is solved
  const checkSolution = () => {
    const isSolved = pieces.every(piece => 
      Math.abs(piece.currentPosition.left - piece.correctPosition.left) < snapThreshold &&
      Math.abs(piece.currentPosition.top - piece.correctPosition.top) < snapThreshold
    );
    
    if (isSolved && !rewardClaimed) {
      setSolved(true);
      setRewardClaimed(true);
      
      // Add a delay before calling onSolve and onClose
      setTimeout(() => {
        onSolve();
        setTimeout(() => {
          onClose();
        }, 500);
      }, 1500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            {solved ? "🎉 Puzzle Solved!" : "Solve the Jigsaw Puzzle"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex justify-center mb-4">
            <p className="text-sm text-gray-500">
              Drag and drop the pieces to solve the puzzle
            </p>
          </div>
          
          <div className="flex justify-center">
            <canvas 
              ref={canvasRef}
              className="border border-gray-300 rounded"
              width={puzzleSize}
              height={puzzleSize}
            />
          </div>
          
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

export default JigsawPuzzle;
