import React from 'react';
import { User } from './Game';

interface ScoreboardProps {
  users: User[];
}
const Scoreboard: React.FC<ScoreboardProps> = ({ users }) => {
  return (
    <div id="scoreboard">
      <h2>Scoreboard</h2>
      {users.map((user: User) => {
        return (
          <div key={user.id}>
            <b>{user.username}:</b> {user.points} points
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
