import React from 'react';
import Socket from '../utils/Socket';
interface HomeProps {
  setUsername: (username: string) => void;
}
const Home: React.FC<HomeProps> = (props) => {
  const [usernameInput, setUsernameInput] = React.useState('');
  return (
    <div id="home-container">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (usernameInput === '') {
            return;
          }
          props.setUsername(usernameInput);
          Socket.initializeSocket(usernameInput);
        }}
      >
        <input
          type="text"
          placeholder="Enter your username"
          value={usernameInput}
          onChange={(ev) => setUsernameInput(ev.target.value)}
        />
        <input type="submit" value="Start game" className="btn btn-style-1" />
      </form>
    </div>
  );
};

export default Home;
