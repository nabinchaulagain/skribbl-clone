import React from 'react';
import Socket from '../utils/Socket';

const KickButton: React.FC = () => {
  const [isClicked, setIsClicked] = React.useState(false);
  const socket = Socket.getSocket();
  return (
    <div id="kick-container">
      <button
        className="btn btn-style-2"
        disabled={isClicked}
        onClick={() => {
          if (isClicked) {
            return;
          }
          socket.emit('voteKick', 1);
          setIsClicked(true);
        }}
      >
        Kick out
      </button>
    </div>
  );
};

export default KickButton;
