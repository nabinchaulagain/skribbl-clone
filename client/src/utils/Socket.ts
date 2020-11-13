import io from 'socket.io-client';
class Socket {
  static socket: SocketIOClient.Socket | undefined;

  public static initializeSocket(username: string): void {
    Socket.socket = io('/', {
      transports: ['websocket'],
      query: `username=${username}`,
    });
  }

  public static getSocket(): SocketIOClient.Socket {
    return this.socket as SocketIOClient.Socket;
  }
}
export default Socket;
