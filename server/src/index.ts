import express from 'express';
import Room from './Room';
import User from './User';
import config from './config';

const app = express();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`server listening on ${PORT}`);
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io: SocketIO.Socket = require('socket.io')(server);
let rooms: Room[] = [];
io.on('connection', (socket: SocketIO.Socket): void => {
  if (rooms.length === 0) {
    rooms.push(new Room());
  }
  let roomIdx = rooms.findIndex((room) => !room.isFull());
  if (roomIdx === -1) {
    rooms.push(new Room());
    roomIdx = rooms.length - 1;
  }
  const room = rooms[roomIdx];
  const user = new User(socket.id, socket, socket.handshake.query.username);
  room.addUser(user);
  socket.emit('usersState', room.getUsersState());
  if (room.gameStarted && room.round && room.round.isActive) {
    const roundInfo = room.getRoundInfo();
    socket.emit('gameStart');
    socket.emit('roundStart', {
      ...roundInfo,
      word: roundInfo.word.replace(/./gs, '_'),
    });
    socket.emit('drawingState', room.drawingState);
  }
  if (room.users.length === config.MIN_PLAYERS_PER_ROOM) {
    room.startGame();
    room.startRound();
  }
  socket.on('lineDraw', (msg): void => {
    if (room.getActiveUser().id === user.id) {
      room.addToDrawingState(msg);
      room.broadcast('lineDraw', msg, user);
    }
  });
  socket.on('chatMsg', (msg): void => {
    const round = room.round;
    if (round && round.isActive && room.getActiveUser()) {
      if (user.id === room.getActiveUser().id) {
        room.broadcastChatMsgToCorrectGuessers({
          msg: msg.msg,
          type: 'good',
          username: user.username,
        });
        return;
      }
      if (round.didUserGuess(user.id)) {
        room.broadcastChatMsgToCorrectGuessers({
          msg: msg.msg,
          type: 'good',
          username: user.username,
        });
      } else {
        if (round.word === msg.msg) {
          user.socket.emit('chatMsg', {
            msg: msg.msg,
            type: 'good',
            username: user.username,
          });
          room.broadcastChatMsgToCorrectGuessers({
            msg: msg.msg,
            type: 'good',
            username: user.username,
          });
          room.broadcastChatMsg({
            type: 'good',
            msg: `${user.username} guessed the word correctly`,
          });
          round.assignUserScore(user.id);
          if (
            round.didEveryoneGuessCorrectly(room.getActiveUser().id, room.users)
          ) {
            clearTimeout(room.endRoundTimeOut as NodeJS.Timeout);
            room.endRound();
            room.endRoundTimeOut = setTimeout(
              () => room.startNextRound(),
              config.ROUND_DELAY
            );
          }
        } else {
          room.broadcastChatMsg({ ...msg, username: user.username });
        }
      }
    } else {
      room.broadcastChatMsg({ ...msg, username: user.username });
    }
  });
  socket.on('voteKick', () => {
    if (room.getActiveUser() && room.round && room.round.isActive) {
      room.round.kickVotes[user.id] = true;
      const kickVotes = room.round.getVoteKicks(room.users);
      const voteRequirement = Math.ceil(room.users.length / 2);
      room.broadcastChatMsg(
        {
          msg: `'${user.username}' is voting to kick out ${
            room.getActiveUser().username
          }(${kickVotes}/${voteRequirement})`,
          type: 'warn',
        },
        room.getActiveUser()
      );
      if (kickVotes >= voteRequirement) {
        room.getActiveUser().socket.emit('kickOut', 1);
      }
    }
  });
  socket.on('disconnect', (): void => {
    const activeUser = room.getActiveUser();
    room.removeUser(user);
    if (room.users.length < config.MIN_PLAYERS_PER_ROOM) {
      if (room.gameStarted) {
        room.endGame();
        rooms = rooms.filter((rm) => room !== rm);
        return;
      }
    }
    if (activeUser && activeUser.id === user.id) {
      room.activeUserIdx--;
      clearTimeout(room.endRoundTimeOut as NodeJS.Timeout);
      room.endRound(activeUser);
      room.endRoundTimeOut = setTimeout(
        () => room.startNextRound(),
        config.ROUND_DELAY
      );
    }
  });
});
