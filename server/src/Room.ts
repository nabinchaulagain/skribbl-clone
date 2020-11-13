import config from './config';
import User from './User';
export type ChatMsg = { msg: string; type: string };
export default class Room {
  users: User[];
  drawingState: any[];
  gameStarted: boolean;
  activeUserIdx: number;
  gameStartTime: number | null;
  endRoundTimeOut: NodeJS.Timeout | null;

  constructor() {
    this.users = [];
    this.drawingState = [];
    this.gameStarted = false;
    this.activeUserIdx = 0;
    this.gameStartTime = null;
    this.endRoundTimeOut = null;
  }

  isFull(): boolean {
    return this.users.length === config.MAX_PLAYERS_PER_ROOM;
  }
  getActiveUser(): User {
    return this.users[this.activeUserIdx];
  }

  addUser(user: User): void {
    if (this.users.length > config.MAX_PLAYERS_PER_ROOM) {
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
  startGame(): void {
    this.broadcast('gameStart', 1);
    this.gameStarted = true;
  }
  endGame(): void {
    this.broadcast('gameEnd', 1);
  }
  getRoundInfo() {
    return {
      socketId: this.getActiveUser().id,
      startTime: this.gameStartTime,
      timeToComplete: config.TIME_TO_COMPLETE,
    };
  }
  startRound(): void {
    this.gameStartTime = Date.now();
    this.broadcast('roundStart', this.getRoundInfo());
    this.endRoundTimeOut = setTimeout(() => {
      this.endRound();
      setTimeout(() => this.startNextRound(), config.ROUND_DELAY);
    }, config.TIME_TO_COMPLETE);
  }
  endRound(): void {
    this.broadcast('roundEnd', 1);
  }
  startNextRound(): void {
    this.activeUserIdx++;
    this.drawingState = [];
    if (this.activeUserIdx >= this.users.length) {
      this.endGame();
    } else {
      this.startRound();
    }
  }
  broadcastChatMsg(msg: ChatMsg) {
    this.broadcast('chatMsg', msg);
  }
}
