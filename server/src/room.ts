import cfg from './config';
export type User = { id: string; socket: SocketIO.Socket };
export default class Room {
  users: User[];
  drawingState: any[];
  constructor() {
    this.users = [];
    this.drawingState = [];
  }
  isFull(): boolean {
    return this.users.length === cfg.MAX_PLAYERS_PER_ROOM;
  }
  addUser(user: User): void {
    if (this.users.length > cfg.MAX_PLAYERS_PER_ROOM) {
      throw new Error('too many players');
    }
    this.users.push(user);
  }
  removeUser(user: User): void {
    this.users = this.users.filter((usr) => usr.id !== user.id);
  }
  broadcast(
    msg: string,
    payload: unknown,
    excludedUser: User | undefined = undefined
  ): void {
    this.users.forEach((user: User): void => {
      if (!excludedUser || (excludedUser && user.id !== excludedUser.id)) {
        user.socket.emit(msg, payload);
      }
    });
  }
  addToDrawingState(drawing: any): void {
    this.drawingState.push(drawing);
  }
  clearDrawingState(): void {
    this.drawingState = [];
  }
}
