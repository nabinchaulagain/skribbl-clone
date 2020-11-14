import '../styles/index.css';
import React, { useEffect } from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import StylePicker from './StylePicker';
import Socket from '../utils/Socket';
import Timer, { RoundTime } from './Timer';
import Chatbox from './Chatbox';
import Scoreboard from './Scoreboard';

interface GameProps {
  canvasWidth: number;
  canvasHeight: number;
  username: string;
  exitGame: () => void;
}

export type User = {
  id: string;
  points: number;
  username: string;
};

const Game: React.FC<GameProps> = ({ canvasWidth, canvasHeight, exitGame }) => {
  const [users, setUsers] = React.useState<User[]>([]);
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
    exitGame();
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
    socket.on('usersState', (users: User[]) => {
      setUsers(users);
    });
  }, []);
  useEffect(() => {
    socket.on('userJoin', (user: User) => {
      setUsers([...users, user]);
    });
    socket.on('userLeave', (user: User) => {
      setUsers(users.filter((usr) => usr.id !== user.id));
    });
    return () => {
      socket.removeEventListener('userJoin');
      socket.removeEventListener('userLeave');
    };
  }, [users]);
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
          <Scoreboard users={users}></Scoreboard>
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
