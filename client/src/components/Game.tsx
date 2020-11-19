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
import KickButton from './KickButton';
import Socket from '../utils/Socket';

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
  const {
    drawingPermission,
    isGameStarted,
    isWaitingForNextRd,
    activeUserId,
  } = React.useContext(GameContext) as GameContextProps;
  const socket = Socket.getSocket();
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
        {isGameStarted && !isWaitingForNextRd && activeUserId !== socket.id && (
          <KickButton></KickButton>
        )}
      </div>
    </>
  );
};

export default Game;
