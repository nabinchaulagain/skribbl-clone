import React from 'react';
import { GameContext, GameContextProps } from '../providers/GameProvider';

const Scoreboard: React.FC = () => {
  const { users, activeUserId } = React.useContext(
    GameContext
  ) as GameContextProps;
  return (
    <div id="scoreboard">
      <h2>Scoreboard</h2>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <b>{user.username}:</b> {user.score} points
            {user.id === activeUserId && <span id="pencil">&#9998;</span>}
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
