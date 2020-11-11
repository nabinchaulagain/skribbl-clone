import React, { useState } from 'react';
import socket from '../utils/socket';
import { waitFor } from '../utils';

interface DrawingBoardProviderProps {
  children: React.ReactNode;
  drawingPermission: boolean;
  isGameStarted: boolean;
}
type BoardEvent = React.MouseEvent<HTMLCanvasElement, MouseEvent>;
type PickerEvent = React.ChangeEvent<HTMLInputElement>;

export interface DrawingBoardContextProps {
  isDrawing: boolean;
  setIsDrawing: (newVal: boolean) => void;
  handleMouseMove: (ev: BoardEvent) => void;
  handleMouseUp: (ev: BoardEvent) => void;
  handleMouseDown: (ev: BoardEvent) => void;
  ctx: CanvasRenderingContext2D;
  setCtx: (ctx: CanvasRenderingContext2D) => void;
  color: string;
  handleColorChange: (ev: PickerEvent) => void;
  brushSize: number;
  handleBrushSizeChange: (ev: PickerEvent) => void;
}
export interface Line {
  x: number;
  y: number;
  color: string;
  brushSize: number;
  isEnding: boolean;
}

export const DrawingBoardContext = React.createContext<
  Partial<DrawingBoardContextProps>
>({});

const DrawingBoardProvider = (
  props: DrawingBoardProviderProps
): JSX.Element => {
  if (!props.isGameStarted) {
    return <>waiting for others to join...</>;
  }
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(10);
  React.useEffect(() => {
    if (ctx) {
      socket.on('lineDraw', (line: Line) => {
        drawLine(line);
      });
      socket.on('drawingState', async (lines: Line[]) => {
        for (const line of lines) {
          drawLine(line);
          await waitFor(5);
        }
      });
      socket.on('roundStart', () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      });
    }
  }, [ctx]);

  const drawLine = (line: Line) => {
    if (!ctx) {
      return;
    }
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.brushSize;
    ctx.lineTo(line.x, line.y);
    ctx.stroke();
    if (line.isEnding) {
      ctx.beginPath();
    }
  };

  const draw = (ev: BoardEvent, isEnding = false) => {
    if (!ctx || !isDrawing || !props.drawingPermission) {
      return;
    }
    const newLine = {
      x: ev.clientX - ctx.canvas.offsetLeft,
      y: ev.clientY - ctx.canvas.offsetTop,
      color,
      brushSize,
      isEnding,
    };
    drawLine(newLine);
    socket.emit('lineDraw', newLine);
  };
  const handleMouseMove = (ev: BoardEvent): void => {
    draw(ev);
  };
  const handleMouseDown = (ev: BoardEvent): void => {
    setIsDrawing(true);
    draw(ev);
  };
  const handleMouseUp = (ev: BoardEvent): void => {
    draw(ev, true);
    setIsDrawing(false);
  };
  const handleColorChange = (ev: PickerEvent): void => {
    setColor(ev.target.value);
  };
  const handleBrushSizeChange = (ev: PickerEvent): void => {
    setBrushSize(parseInt(ev.target.value));
  };
  return (
    <DrawingBoardContext.Provider
      value={{
        isDrawing,
        setIsDrawing,
        setCtx,
        ctx,
        handleMouseMove,
        handleMouseDown,
        handleMouseUp,
        color,
        brushSize,
        handleBrushSizeChange,
        handleColorChange,
      }}
    >
      {props.children}
    </DrawingBoardContext.Provider>
  );
};

export default DrawingBoardProvider;
