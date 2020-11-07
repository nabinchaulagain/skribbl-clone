import React, { useContext } from 'react';
import {
  DrawingBoardContext,
  DrawingBoardContextProps,
} from '../providers/DrawingBoardProvider';
const StylePicker: React.FC = () => {
  const context = useContext(DrawingBoardContext) as DrawingBoardContextProps;
  return (
    <form>
      <label>Color</label>
      <input
        type="color"
        value={context.color}
        onChange={context.handleColorChange}
      />
      <label> Brush size</label>
      <input
        type="range"
        min={5}
        max={50}
        value={context.brushSize}
        onChange={context.handleBrushSizeChange}
      />
    </form>
  );
};
export default StylePicker;
