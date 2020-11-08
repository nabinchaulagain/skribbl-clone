import '../styles/index.scss';
import React from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import StylePicker from './StylePicker';
interface AppProps {
  canvasWidth: number;
  canvasHeight: number;
}
const App: React.FC<AppProps> = ({ canvasWidth, canvasHeight }) => {
  return (
    <DrawingBoardProvider>
      <DrawingBoard width={canvasWidth} height={canvasHeight}></DrawingBoard>
      <StylePicker></StylePicker>
    </DrawingBoardProvider>
  );
};

export default App;
