import { SocketMock } from './Socket';

export default (
  socket: SocketMock | SocketIOClient.Socket
): { emit: (msg: string, arg: unknown) => void } => {
  return {
    emit: (msg: string, arg: unknown): void => {
      const listeners = socket.listeners(msg);
      listeners.forEach((listener) => listener(arg));
    },
  };
};
