import React, { useContext } from 'react';
import {
  DrawingBoardContext,
  DrawingBoardContextProps,
} from '../providers/DrawingBoardProvider';
const StylePicker: React.FC = () => {
  const context = useContext(DrawingBoardContext) as DrawingBoardContextProps;
  return (
    <form id="stylepicker-container">
      <label htmlFor="color-picker">Color</label>
      <input
        id="color-picker"
        type="color"
        value={context.color}
        onChange={context.handleColorChange}
      />
      <label htmlFor="brush-size"> Brush size</label>
      <input
        id="brush-size"
        type="range"
        min={5}
        max={30}
        value={context.brushSize}
        onChange={context.handleBrushSizeChange}
      />
    </form>
  );
};
export default StylePicker;
