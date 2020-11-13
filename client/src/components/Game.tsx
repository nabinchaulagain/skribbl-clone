import '../styles/index.css';
import React, { useEffect } from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import StylePicker from './StylePicker';
import Socket from '../utils/Socket';
import Timer, { RoundTime } from './Timer';
import Chatbox from './Chatbox';

interface GameProps {
  canvasWidth: number;
  canvasHeight: number;
  username: string;
}
const Game: React.FC<GameProps> = ({ canvasWidth, canvasHeight }) => {
  const [drawingPermission, setDrawingPermission] = React.useState(false);
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  const [isRoundStarted, setIsRoundStarted] = React.useState(false);
  const [roundTime, setRoundTime] = React.useState<null | RoundTime>(null);
  const socket = Socket.getSocket();
  const endRound = (): void => {
    setIsRoundStarted(false);
    setDrawingPermission(false);
    setRoundTime(null);
  };
  const endGame = (): void => {
    endRound();
    socket.disconnect();
  };
  useEffect(() => {
    socket.on('gameStart', (): void => {
      setIsGameStarted(true);
    });
    socket.on('roundStart', (msg: any): void => {
      if (msg.socketId === socket.id) {
        setDrawingPermission(true);
      } else {
        setDrawingPermission(false);
      }
      setRoundTime({
        timeToComplete: msg.timeToComplete,
        startTime: msg.startTime,
      });
      setIsRoundStarted(true);
    });
    socket.on('roundEnd', endRound);
    socket.on('gameEnd', endGame);
  }, []);
  return (
    <>
      <div>
        {drawingPermission && 'Your Turn to draw!!'}
        {isRoundStarted && roundTime && <Timer roundTime={roundTime}></Timer>}
      </div>
      <div id="game-container">
        <DrawingBoardProvider
          drawingPermission={drawingPermission}
          isGameStarted={isGameStarted}
        >
          <DrawingBoard
            width={canvasWidth}
            height={canvasHeight}
          ></DrawingBoard>
          {drawingPermission && <StylePicker></StylePicker>}
        </DrawingBoardProvider>
        {isGameStarted && <Chatbox></Chatbox>}
      </div>
    </>
  );
};

export default Game;
