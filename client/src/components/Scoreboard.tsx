import React from 'react';
import { GameContext, GameContextProps } from '../providers/GameProvider';

const Scoreboard: React.FC = () => {
  const { users, activeUserId } = React.useContext(
    GameContext
  ) as GameContextProps;
  const usersSorted = users.sort((userA, userB) => {
    if (userA.score < userB.score) {
      return 1;
    } else if (userA.score > userB.score) {
      return -1;
    } else {
      return 0;
    }
  });
  const rankings: Record<string, number> = {};
  usersSorted.forEach((user, idx) => (rankings[user.id] = idx + 1));
  return (
    <div id="scoreboard">
      <h2>Scoreboard</h2>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <div className="rank">#{rankings[user.id]}</div>
            <div className="points">
              <b>{user.username}:</b> {user.score} points
              {user.id === activeUserId && <span id="pencil">&#9998;</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
