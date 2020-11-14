import React from 'react';
import Game from './Game';
import Home from './Home';

const App: React.FC = () => {
  const [username, setUsername] = React.useState<string | null>(null);
  if (username === null) {
    return <Home setUsername={setUsername}></Home>;
  }
  return (
    <Game
      canvasHeight={700}
      canvasWidth={800}
      username={username}
      exitGame={() => setUsername(null)}
    ></Game>
  );
};

export default App;
