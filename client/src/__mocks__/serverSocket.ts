export default (
  socket: SocketIOClient.Socket
): { emit: (msg: string, arg: unknown) => void } => {
  return {
    emit: (msg: string, arg: unknown): void => {
      //@ts-expect-error
      const listener = socket.listeners[msg][0];
      listener(arg);
    },
  };
};
