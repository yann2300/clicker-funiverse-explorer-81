
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
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleSize = 300;
  const gridSize = 3;
  const pieceSize = puzzleSize / gridSize;
  const snapThreshold = 20; // Distance in pixels for snapping

  // Preload the image when component mounts
  useEffect(() => {
    if (isOpen) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        setImage(img);
      };
      img.onerror = (e) => {
        console.error('Failed to load puzzle image:', e);
      };
    } else {
      setImage(null);
    }
  }, [isOpen, imageUrl]);

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

  // Create jigsaw pieces once image and canvas are ready
  useEffect(() => {
    if (isOpen && canvas && image && !loaded) {
      // Clear any existing pieces
      canvas.clear();
      setPieces([]);
      
      // Calculate scale to fit image within puzzle size
      const scale = Math.min(
        puzzleSize / image.width,
        puzzleSize / image.height
      );
      
      // Center the image
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      const offsetX = (puzzleSize - scaledWidth) / 2;
      const offsetY = (puzzleSize - scaledHeight) / 2;
      
      const newPieces: JigsawPiece[] = [];
      
      // Create the jigsaw pieces (3x3 grid)
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const id = row * gridSize + col;
          
          // Calculate clip position
          const clipX = (col * (image.width / gridSize));
          const clipY = (row * (image.height / gridSize));
          const clipWidth = image.width / gridSize;
          const clipHeight = image.height / gridSize;
          
          // Create a temporary canvas to hold the piece image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = clipWidth;
          tempCanvas.height = clipHeight;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            // Draw the portion of the image onto the temporary canvas
            tempCtx.drawImage(
              image,
              clipX, clipY, clipWidth, clipHeight,
              0, 0, clipWidth, clipHeight
            );
            
            // Create a fabric image from the temp canvas
            fabric.Image.fromURL(tempCanvas.toDataURL(), (fabricImg) => {
              // Scale image to fit piece size
              fabricImg.scale(pieceSize / clipWidth);
              
              // Calculate correct position on grid
              const correctLeft = col * pieceSize;
              const correctTop = row * pieceSize;
              
              // Random initial position (but avoid edges)
              const randomLeft = Math.random() * (puzzleSize - pieceSize - 20) + 10;
              const randomTop = Math.random() * (puzzleSize - pieceSize - 20) + 10;
              
              // Configure the piece
              fabricImg.set({
                left: randomLeft,
                top: randomTop,
                originX: 'left',
                originY: 'top',
                hasControls: false,
                hasBorders: false,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
                cornerSize: 10,
                transparentCorners: false,
                stroke: '#666',
                strokeWidth: 2,
                shadow: new fabric.Shadow({
                  color: 'rgba(0,0,0,0.3)',
                  blur: 5,
                  offsetX: 2,
                  offsetY: 2
                })
              });
              
              // Create and store piece data
              const piece: JigsawPiece = {
                id,
                fabricObject: fabricImg,
                correctPosition: { left: correctLeft, top: correctTop },
                currentPosition: { left: randomLeft, top: randomTop },
                row,
                col
              };
              
              newPieces.push(piece);
              
              // Add piece to canvas
              canvas.add(fabricImg);
              
              // Once all pieces are created, set up the pieces state and event handlers
              if (newPieces.length === gridSize * gridSize) {
                setPieces(newPieces);
                setLoaded(true);
                setSolved(false);
                
                // Set up drag and drop handlers
                canvas.on('object:moving', handlePieceMoving);
                canvas.on('object:modified', checkSolution);
              }
            });
          }
        }
      }
    }
  }, [isOpen, canvas, loaded, imageUrl, image, pieceSize, gridSize, puzzleSize]);

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
