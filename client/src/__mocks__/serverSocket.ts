import { Line } from '../providers/DrawingBoardProvider';
export default (
  socket: SocketIOClient.Socket
): { emit: (msg: string, arg: Line) => void } => {
  return {
    emit: (msg: string, arg: Line): void => {
      //@ts-expect-error
      const listener = socket.listeners[msg][0];
      listener(arg);
    },
  };
};
