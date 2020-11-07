import express from 'express';

const app = express();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`server listening on ${PORT}`);
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io: SocketIO.Socket = require('socket.io')(server);

type User = { id: string; socket: SocketIO.Socket };
const users: User[] = [];

io.on('connection', (socket: SocketIO.Socket) => {
  users.push({ id: socket.id, socket });
  socket.on('lineDraw', (msg) => {
    users
      .filter((user) => user.id !== socket.id)
      .forEach((user) => user.socket.emit('lineDraw', msg));
  });
});
