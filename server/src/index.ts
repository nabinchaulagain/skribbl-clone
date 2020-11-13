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
  if (room.gameStarted) {
    socket.emit('gameStart');
    socket.emit('roundStart', room.getRoundInfo());
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
    room.broadcastChatMsg(msg);
  });
  socket.on('disconnect', (): void => {
    const activeUser = room.getActiveUser();
    room.removeUser(user);
    if (room.users.length < config.MIN_PLAYERS_PER_ROOM) {
      room.endGame();
      rooms = rooms.filter((rm) => room !== rm);
      return;
    }
    if (activeUser.id === user.id) {
      room.activeUserIdx--;
      clearTimeout(room.endRoundTimeOut as NodeJS.Timeout);
      room.endRound();
      room.startNextRound();
    }
  });
});
