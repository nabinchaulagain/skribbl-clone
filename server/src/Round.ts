import fs from 'fs';
import config from './config';
import User from './User';

const words: string[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../words.json`).toString()
);

type UserGuess = {
  userId: string;
  guessedCorrectly: boolean;
  points: number;
};

class Round {
  startTime: number;
  timeToComplete: number;
  word: string;
  isActive: boolean;
  userGuesses: UserGuess[];

  constructor(users: User[]) {
    this.word = this.pickRandomWord();
    this.timeToComplete = this.word.length * config.TIME_PER_LETTER;
    this.startTime = Date.now();
    this.isActive = true;
    this.userGuesses = users.map((user) => {
      return {
        userId: user.id,
        guessedCorrectly: false,
        points: 0,
      };
    });
  }
  pickRandomWord(): string {
    return words[Math.floor(Math.random() * words.length)];
  }
  private getUserGuess(userId: string): UserGuess {
    const userGuess = this.userGuesses.find(
      (guess) => guess.userId == userId
    ) as UserGuess;
    return userGuess;
  }
  didUserGuess(userId: string): boolean {
    const userGuess = this.getUserGuess(userId);
    return userGuess.guessedCorrectly;
  }
  assignUserPoints(userId: string): void {
    const userGuess = this.getUserGuess(userId);
    userGuess.guessedCorrectly = true;
    userGuess.points = 500;
  }
}

export default Round;
