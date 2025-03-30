import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';

export interface JigsawPuzzleProps {
  onSolve: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const JigsawPuzzle = ({ onSolve, isOpen, onClose }: JigsawPuzzleProps) => {
  const stageRef = useRef(null);
  const [pieces, setPieces] = useState([]);
  const [solved, setSolved] = useState(false);
  const [width, setWidth] = useState(window.innerWidth / 2);
  const [height, setHeight] = window.innerHeight / 2;
  const gridSize = 5;
  const pieceSize = Math.min(width, height) / gridSize;
  const puzzleImage = '/images/jigsaw-image.jpg'; // Path to your image

  useEffect(() => {
    if (!isOpen) return;

    const generatePieces = () => {
      const newPieces = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = j * pieceSize;
          const y = i * pieceSize;
          newPieces.push({
            id: `${i}-${j}`,
            x: x,
            y: y,
            correctX: x,
            correctY: y,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
          });
        }
      }
      // Shuffle pieces
      for (let i = newPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPieces[i], newPieces[j]] = [newPieces[j], newPieces[i]];
        newPieces[i].x = Math.random() * (width - pieceSize);
        newPieces[i].y = Math.random() * (height - pieceSize);
      }
      setPieces(newPieces);
    };

    generatePieces();
    setSolved(false);

    const handleResize = () => {
      setWidth(window.innerWidth / 2);
      setHeight(window.innerHeight / 2);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, width, height]);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setPieces(
      pieces.map((piece) => {
        if (piece.id === id) {
          return {
            ...piece,
            isDragging: true,
          };
        } else {
          return piece;
        }
      })
    );
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    setPieces(
      pieces.map((piece) => {
        if (piece.id === id) {
          const tolerance = pieceSize / 2;
          const diffX = Math.abs(e.target.x() - piece.correctX);
          const diffY = Math.abs(e.target.y() - piece.correctY);

          if (diffX < tolerance && diffY < tolerance) {
            e.target.x(piece.correctX);
            e.target.y(piece.correctY);
            return {
              ...piece,
              isDragging: false,
              x: piece.correctX,
              y: piece.correctY,
            };
          } else {
            return {
              ...piece,
              isDragging: false,
            };
          }
        } else {
          return piece;
        }
      })
    );
  };

  useEffect(() => {
    if (pieces.length > 0) {
      const solvedPuzzle = pieces.every(
        (piece) =>
          Math.abs(piece.x - piece.correctX) < 5 &&
          Math.abs(piece.y - piece.correctY) < 5
      );
      if (solvedPuzzle && !solved) {
        setSolved(true);
        onSolve();
        onClose();
      }
    }
  }, [pieces, solved, onSolve, onClose]);

  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <Stage width={width} height={height} ref={stageRef}>
        <Layer>
          {pieces.map((piece, index) => (
            <Rect
              key={piece.id}
              id={piece.id}
              x={piece.x}
              y={piece.y}
              width={pieceSize}
              height={pieceSize}
              fillPatternImage={new Image()}
              fillPatternOffset={{ x: piece.correctX, y: piece.correctY }}
              fillPatternScale={{ x: 1 / pieceSize, y: 1 / pieceSize }}
              stroke="black"
              strokeWidth={1}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              opacity={piece.isDragging ? 0.7 : 1}
              cornerRadius={5}
              fillPatternRepeat="no-repeat"
              fillPatternImageSmoothingEnabled={false}
              fill={`url(${puzzleImage})`}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default JigsawPuzzle;
