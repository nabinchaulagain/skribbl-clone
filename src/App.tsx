import './styles/index.scss';
import React from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from './DrawingBoardContext';
import StylePicker from './StylePicker';

const App: React.FC = () => {
  return (
    <DrawingBoardProvider>
      <DrawingBoard width={500} height={400}></DrawingBoard>
      <StylePicker></StylePicker>
    </DrawingBoardProvider>
  );
};

export default App;
