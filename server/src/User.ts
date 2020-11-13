class User {
  id: string;
  socket: SocketIO.Socket;
  points: number;
  username: string;
  constructor(id: string, socket: SocketIO.Socket, username: string) {
    this.id = id;
    this.socket = socket;
    this.points = 0;
    this.username = username;
  }
}

export default User;
