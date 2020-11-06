import React, { useState } from 'react';
interface DrawingBoardProviderProps {
  children: React.ReactNode;
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

export const DrawingBoardContext = React.createContext<
  Partial<DrawingBoardContextProps>
>({});

const DrawingBoardProvider = (
  props: DrawingBoardProviderProps
): JSX.Element => {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(10);
  const draw = (ev: BoardEvent) => {
    if (!ctx || !isDrawing) {
      return;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    const newLine = {
      x: ev.clientX - ctx.canvas.offsetLeft,
      y: ev.clientY - ctx.canvas.offsetTop,
    };
    ctx.lineTo(newLine.x, newLine.y);
    ctx.stroke();
  };
  const handleMouseMove = (ev: BoardEvent): void => {
    draw(ev);
  };
  const handleMouseDown = (ev: BoardEvent): void => {
    setIsDrawing(true);
    draw(ev);
  };
  const handleMouseUp = (ev: BoardEvent): void => {
    setIsDrawing(false);
    draw(ev);
    ctx?.beginPath();
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
