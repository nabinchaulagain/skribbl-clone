import express from 'express';
import Room from './room';

const app = express();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`server listening on ${PORT}`);
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io: SocketIO.Socket = require('socket.io')(server);
let rooms: Room[] = [];

io.on('connection', (socket: SocketIO.Socket) => {
  if (rooms.length === 0) {
    rooms.push(new Room());
  }
  let roomIdx = rooms.findIndex((room) => !room.isFull());
  if (roomIdx === -1) {
    rooms.push(new Room());
    roomIdx = rooms.length - 1;
  }
  const room = rooms[roomIdx];
  const user = { id: socket.id, socket };
  room.addUser(user);
  socket.emit('drawingState', room.drawingState);
  socket.on('lineDraw', (msg) => {
    room.addToDrawingState(msg);
    room.broadcast('lineDraw', msg, user);
  });
  socket.on('disconnect', () => {
    room.removeUser(user);
    if (room.users.length === 0) {
      rooms = rooms.filter((rm) => room !== rm);
    }
    room.broadcast('userDisconnect', 'somebody left the chat');
  });
});
