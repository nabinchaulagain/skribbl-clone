import React, { useLayoutEffect } from 'react';
import {
  DrawingBoardContext,
  DrawingBoardContextProps,
} from './DrawingBoardContext';

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
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    context.setCtx(ctx);
  }, []);
  return (
    <canvas
      ref={ref}
      width={props.width}
      height={props.height}
      onMouseDown={context.handleMouseDown}
      onMouseUp={context.handleMouseUp}
      onMouseMove={context.handleMouseMove}
    ></canvas>
  );
};
export default DrawingBoard;
