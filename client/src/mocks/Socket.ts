type Callback = (arg: any) => void;
type ListenerMap = {
  [event: string]: Callback[];
};

export type SocketMock = {
  listenerMap: ListenerMap;
  on: (msg: string, cb: Callback) => void;
  emit: jest.Mock;
  listeners: (msg: string) => Callback[];
  removeEventListener: jest.Mock;
};

const mockSocket = (): SocketMock => {
  const mockedSocket: SocketMock = {
    listenerMap: {},
    on: function (msg: string, cb: Callback) {
      if (!this.listenerMap[msg]) {
        this.listenerMap[msg] = [];
      }
      this.listenerMap[msg].push(cb);
    },
    listeners: function (msg: string): Callback[] {
      return this.listenerMap[msg];
    },
    removeEventListener: jest.fn(),
    emit: jest.fn(),
  };
  return mockedSocket;
};
export default mockSocket;
