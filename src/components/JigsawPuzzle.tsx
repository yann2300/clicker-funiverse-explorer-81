
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Puzzle } from 'lucide-react';
import { fabric } from 'fabric';

interface JigsawPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
  onSolve: () => void;
  imageUrl?: string;
}

interface JigsawPiece {
  id: number;
  fabricObject: fabric.Object;
  correctPosition: { left: number; top: number };
  currentPosition: { left: number; top: number };
  row: number;
  col: number;
}

const JigsawPuzzle = ({ 
  isOpen, 
  onClose, 
  onSolve, 
  imageUrl = "https://cdn.steamgifts.com/img/cat/default.gif" 
}: JigsawPuzzleProps) => {
  const [pieces, setPieces] = useState<JigsawPiece[]>([]);
  const [solved, setSolved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleSize = 300;
  const gridSize = 3;
  const pieceSize = puzzleSize / gridSize;
  const snapThreshold = 20; // Distance in pixels for snapping

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
      
      // Load the image
      fabric.Image.fromURL(imageUrl, (img) => {
        // Scale image to fit puzzle size
        const scale = puzzleSize / Math.max(img.width || 1, img.height || 1);
        img.scale(scale);
        
        // Center the image if needed
        const imgWidth = (img.width || 0) * scale;
        const imgHeight = (img.height || 0) * scale;
        const offsetX = (puzzleSize - imgWidth) / 2;
        const offsetY = (puzzleSize - imgHeight) / 2;
        
        const newPieces: JigsawPiece[] = [];
        
        // Create jigsaw pieces (3x3 grid)
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const id = row * gridSize + col;
            
            // Calculate position to clip from original image
            const clipX = (col * pieceSize);
            const clipY = (row * pieceSize);
            
            // Create a pattern with the image portion
            const patternImg = new Image();
            patternImg.src = imageUrl;
            
            // Create piece with curved/jigsaw edges
            const piece = new fabric.Rect({
              width: pieceSize,
              height: pieceSize,
              left: Math.random() * (puzzleSize - pieceSize),
              top: Math.random() * (puzzleSize - pieceSize),
              fill: new fabric.Pattern({
                source: patternImg,
                repeat: 'no-repeat',
                offsetX: -clipX,
                offsetY: -clipY,
                patternTransform: [
                  scale, 0, 0, 
                  scale, 
                  offsetX, offsetY
                ]
              }),
              rx: 10, // rounded corners to simulate jigsaw pieces
              ry: 10,
              strokeWidth: 2,
              stroke: '#666',
              shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.3)',
                blur: 5,
                offsetX: 2,
                offsetY: 2
              }),
              originX: 'left',
              originY: 'top',
              hasControls: false,
              hasBorders: false,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true
            });
            
            // Calculate correct position on the grid
            const correctLeft = col * pieceSize;
            const correctTop = row * pieceSize;
            
            // Create and store piece data
            newPieces.push({
              id,
              fabricObject: piece,
              correctPosition: { left: correctLeft, top: correctTop },
              currentPosition: { left: piece.left || 0, top: piece.top || 0 },
              row,
              col
            });
            
            // Add to canvas
            canvas.add(piece);
          }
        }
        
        setPieces(newPieces);
        setLoaded(true);
        setSolved(false);
        
        // Set up drag and drop
        canvas.on('object:moving', handlePieceMoving);
        canvas.on('object:modified', checkSolution);
      });
    }
  }, [isOpen, canvas, loaded, imageUrl, pieceSize, gridSize, puzzleSize]);

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
      e.target.set('stroke', '#666');
      
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
    
    if (isSolved) {
      setSolved(true);
      
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
      <DialogContent className="sm:max-w-md">
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
