
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Puzzle } from 'lucide-react';

interface Piece {
  id: number;
  correctPosition: { row: number; col: number };
  currentPosition: { row: number; col: number };
  image: string;
}

interface JigsawPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
  onSolve: () => void;
  imageUrl?: string;
}

const JigsawPuzzle = ({ isOpen, onClose, onSolve, imageUrl = "https://picsum.photos/300/300" }: JigsawPuzzleProps) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [solved, setSolved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puzzleSize = 300;
  const gridSize = 3;
  const pieceSize = puzzleSize / gridSize;

  // Initialize puzzle pieces
  useEffect(() => {
    if (isOpen && !loaded) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Create a canvas to slice the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = pieceSize;
        canvas.height = pieceSize;
        
        const newPieces: Piece[] = [];
        
        // Create 9 pieces (3x3 grid)
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const id = row * gridSize + col;
            
            // Draw portion of the image on the canvas
            ctx.clearRect(0, 0, pieceSize, pieceSize);
            ctx.drawImage(
              img,
              col * pieceSize, row * pieceSize, pieceSize, pieceSize,
              0, 0, pieceSize, pieceSize
            );
            
            // Convert to data URL
            const pieceImage = canvas.toDataURL('image/png');
            
            newPieces.push({
              id,
              correctPosition: { row, col },
              currentPosition: { row, col },
              image: pieceImage
            });
          }
        }
        
        // Shuffle pieces
        const shuffledPieces = [...newPieces];
        for (let i = shuffledPieces.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          
          // Swap current positions
          const tempPos = { ...shuffledPieces[i].currentPosition };
          shuffledPieces[i].currentPosition = { ...shuffledPieces[j].currentPosition };
          shuffledPieces[j].currentPosition = tempPos;
        }
        
        setPieces(shuffledPieces);
        setLoaded(true);
        setSolved(false);
      };
      
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl, loaded, pieceSize, gridSize]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setLoaded(false);
      setPieces([]);
      setSolved(false);
      setSelectedPiece(null);
    }
  }, [isOpen]);

  // Handle piece selection
  const handlePieceClick = (id: number) => {
    if (solved) return;
    
    if (selectedPiece === null) {
      // Select the first piece
      setSelectedPiece(id);
    } else {
      // Swap pieces
      setPieces(prev => {
        const newPieces = [...prev];
        const piece1Index = newPieces.findIndex(p => p.id === selectedPiece);
        const piece2Index = newPieces.findIndex(p => p.id === id);
        
        if (piece1Index !== -1 && piece2Index !== -1) {
          // Swap current positions
          const tempPos = { ...newPieces[piece1Index].currentPosition };
          newPieces[piece1Index].currentPosition = { ...newPieces[piece2Index].currentPosition };
          newPieces[piece2Index].currentPosition = tempPos;
        }
        
        return newPieces;
      });
      
      // Deselect
      setSelectedPiece(null);
      
      // Check if puzzle is solved
      setTimeout(checkSolution, 300);
    }
  };

  // Check if puzzle is correctly solved
  const checkSolution = () => {
    const isSolved = pieces.every(piece => 
      piece.correctPosition.row === piece.currentPosition.row && 
      piece.correctPosition.col === piece.currentPosition.col
    );
    
    if (isSolved) {
      setSolved(true);
      setTimeout(() => {
        onSolve();
        onClose();
      }, 1500);
    }
  };

  // Draw the puzzle on the canvas
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sort pieces by their current position (row, col)
    const sortedPieces = [...pieces].sort((a, b) => {
      if (a.currentPosition.row !== b.currentPosition.row) {
        return a.currentPosition.row - b.currentPosition.row;
      }
      return a.currentPosition.col - b.currentPosition.col;
    });
    
    // Draw each piece in its current position
    sortedPieces.forEach(piece => {
      const img = new Image();
      img.onload = () => {
        const x = piece.currentPosition.col * pieceSize;
        const y = piece.currentPosition.row * pieceSize;
        
        // Draw the piece
        ctx.drawImage(img, x, y, pieceSize, pieceSize);
        
        // Draw border
        ctx.strokeStyle = selectedPiece === piece.id ? '#ff5500' : '#999';
        ctx.lineWidth = selectedPiece === piece.id ? 3 : 1;
        ctx.strokeRect(x, y, pieceSize, pieceSize);
        
        // Draw piece number for debugging
        // ctx.fillStyle = 'white';
        // ctx.font = '12px Arial';
        // ctx.fillText(`${piece.id}`, x + 5, y + 15);
      };
      img.src = piece.image;
    });
  }, [pieces, loaded, selectedPiece, pieceSize]);

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
              Click two pieces to swap them and solve the puzzle
            </p>
          </div>
          
          <div className="flex justify-center">
            <canvas 
              ref={canvasRef}
              width={puzzleSize}
              height={puzzleSize}
              className="border border-gray-300 cursor-pointer"
              onClick={(e) => {
                if (!canvasRef.current) return;
                
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate which piece was clicked
                const col = Math.floor(x / pieceSize);
                const row = Math.floor(y / pieceSize);
                
                // Find the piece at this position
                const piece = pieces.find(p => 
                  p.currentPosition.row === row && p.currentPosition.col === col
                );
                
                if (piece) {
                  handlePieceClick(piece.id);
                }
              }}
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
