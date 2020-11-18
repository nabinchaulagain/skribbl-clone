import React from 'react';
import { GameContext, GameContextProps } from '../providers/GameProvider';

const Scoreboard: React.FC = () => {
  const { users } = React.useContext(GameContext) as GameContextProps;
  return (
    <div id="scoreboard">
      <h2>Scoreboard</h2>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <b>{user.username}:</b> {user.score} points
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
