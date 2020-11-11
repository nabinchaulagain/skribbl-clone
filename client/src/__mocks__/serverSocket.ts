export default (
  socket: SocketIOClient.Socket
): { emit: (msg: string, arg: unknown) => void } => {
  return {
    emit: (msg: string, arg: unknown): void => {
      //@ts-expect-error
      const listeners: ((arg: unknown) => void)[] = socket.listeners[msg];
      listeners.forEach((listener) => listener(arg));
    },
  };
};
