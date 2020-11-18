import '../styles/index.css';
import React from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import StylePicker from './StylePicker';
import RoundInfo from './RoundInfo';
import Chatbox from './Chatbox';
import Scoreboard from './Scoreboard';
import CanvasOverlay from './RoundScoreOverlay';
import { GameContext, GameContextProps } from '../providers/GameProvider';

interface GameProps {
  canvasWidth: number;
  canvasHeight: number;
}

export type User = {
  id: string;
  score: number;
  username: string;
};

export type RoundScore = {
  userId: string;
  username: string;
  score: number;
};

const Game: React.FC<GameProps> = ({ canvasWidth, canvasHeight }) => {
  const { drawingPermission } = React.useContext(
    GameContext
  ) as GameContextProps;
  return (
    <>
      <RoundInfo></RoundInfo>
      <div id="game-container">
        <CanvasOverlay></CanvasOverlay>
        <DrawingBoardProvider>
          <Scoreboard></Scoreboard>
          <DrawingBoard
            width={canvasWidth}
            height={canvasHeight}
          ></DrawingBoard>
          {drawingPermission && <StylePicker></StylePicker>}
        </DrawingBoardProvider>
        <Chatbox></Chatbox>
      </div>
    </>
  );
};

export default Game;
