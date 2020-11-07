import '../styles/index.scss';
import React from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import StylePicker from './StylePicker';
const App: React.FC = () => {
  return (
    <DrawingBoardProvider>
      <DrawingBoard width={800} height={700}></DrawingBoard>
      <StylePicker></StylePicker>
    </DrawingBoardProvider>
  );
};

export default App;
