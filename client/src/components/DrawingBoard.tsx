import React, { useLayoutEffect } from 'react';
import {
  DrawingBoardContext,
  DrawingBoardContextProps,
} from '../providers/DrawingBoardProvider';

interface DrawingBoardProps {
  width: number;
  height: number;
}

const DrawingBoard: React.FC<DrawingBoardProps> = (props) => {
  const context = React.useContext(
    DrawingBoardContext
  ) as DrawingBoardContextProps;
  const ref = React.useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    canvas.height = props.height;
    canvas.width = props.width;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.lineWidth = context.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    context.setCtx(ctx);
  }, []);
  return (
    <canvas
      ref={ref}
      onMouseDown={context.handleMouseDown}
      onMouseUp={context.handleMouseUp}
      onMouseMove={context.handleMouseMove}
      data-testid="canvas"
    ></canvas>
  );
};
export default DrawingBoard;
