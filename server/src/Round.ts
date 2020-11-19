import fs from 'fs';
import config from './config';
import User from './User';

const words: string[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../words.json`).toString()
);

class Round {
  startTime: number;
  timeToComplete: number;
  word: string;
  isActive: boolean;
  userScores: Record<string, number>;
  kickVotes: Record<string, boolean>;

  constructor() {
    this.word = this.pickRandomWord();
    this.timeToComplete = this.word.length * config.TIME_PER_LETTER;
    this.startTime = Date.now();
    this.isActive = true;
    this.userScores = {};
    this.kickVotes = {};
  }
  pickRandomWord(): string {
    return words[Math.floor(Math.random() * words.length)];
  }
  didUserGuess(userId: string): boolean {
    return Boolean(this.userScores[userId]);
  }
  assignUserScore(userId: string): void {
    const currTime = Date.now();
    const startTime = this.startTime;
    const multFactor = 1 - (currTime - startTime) / this.timeToComplete;
    let score = Math.round(multFactor * config.MAX_ROUND_POINTS);
    if (score < config.ROUND_POINT_THRESHOLD) {
      score = config.ROUND_POINT_THRESHOLD;
    }
    this.userScores[userId] = score;
  }
  didEveryoneGuessCorrectly(activeUserId: string, users: User[]): boolean {
    for (const user of users) {
      if (user.id === activeUserId) {
        continue;
      }
      if (this.userScores[user.id] === undefined) {
        return false;
      }
    }
    return true;
  }
  getScores(activeUserId: string, users: User[]): Record<string, number> {
    const userScoresFinal: Record<string, number> = {};
    let correctGuesses = 0;
    for (const user of users) {
      if (user.id === activeUserId) {
        continue;
      }
      const score = this.userScores[user.id];
      if (score !== undefined) {
        correctGuesses++;
        userScoresFinal[user.id] = this.userScores[user.id];
      } else {
        userScoresFinal[user.id] = 0;
      }
    }
    userScoresFinal[activeUserId] = Math.round(
      (correctGuesses / (users.length - 1)) * config.MAX_ROUND_POINTS
    );
    return userScoresFinal;
  }
  getVoteKicks(users: User[]): number {
    let numVotes = 0;
    for (const user of users) {
      if (this.kickVotes[user.id]) {
        numVotes++;
      }
    }
    return numVotes;
  }
}

export default Round;
