import '../styles/index.css';
import React, { useEffect } from 'react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import StylePicker from './StylePicker';
import Socket from '../utils/Socket';
import RoundInfo, { RoundTime } from './RoundInfo';
import Chatbox from './Chatbox';
import Scoreboard from './Scoreboard';
import CanvasOverlay from './RoundScoreOverlay';

interface GameProps {
  canvasWidth: number;
  canvasHeight: number;
  username: string;
  exitGame: () => void;
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

const Game: React.FC<GameProps> = ({ canvasWidth, canvasHeight, exitGame }) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [drawingPermission, setDrawingPermission] = React.useState(false);
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  const [isWaitingForNextRd, setIsWaitingForNextRd] = React.useState(false);
  const [roundTime, setRoundTime] = React.useState<null | RoundTime>(null);
  const [word, setWord] = React.useState<null | string>(null);
  const [roundScores, setRoundScores] = React.useState<RoundScore[]>([]);
  const socket = Socket.getSocket();
  const endRound = (): void => {
    setDrawingPermission(false);
    setIsWaitingForNextRd(true);
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
      setIsWaitingForNextRd(false);
      setRoundTime({
        timeToComplete: msg.timeToComplete,
        startTime: msg.startTime,
      });
      setWord(msg.word);
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
    socket.on('roundScores', (rdScores: Record<string, number>) => {
      const newUsers: User[] = [];
      const rdScoresCurr: RoundScore[] = [];
      for (const user of users) {
        rdScoresCurr.push({
          userId: user.id,
          score: rdScores[user.id],
          username: user.username,
        });
        const newUser = { ...user, score: user.score + rdScores[user.id] };
        newUsers.push(newUser);
      }
      setRoundScores(rdScoresCurr);
      setUsers(newUsers);
    });
    return () => {
      socket.removeEventListener('userJoin');
      socket.removeEventListener('userLeave');
      socket.removeEventListener('roundScores');
    };
  }, [users]);
  return (
    <>
      <RoundInfo
        roundTime={roundTime}
        word={word}
        isWaitingForNextRd={isWaitingForNextRd}
      ></RoundInfo>
      <div id="game-container">
        <CanvasOverlay
          isWaitingForNextRd={isWaitingForNextRd}
          roundScores={roundScores}
          word={word}
        ></CanvasOverlay>
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
