import React from 'react';
import socket from '../utils/socket';
const ChatForm: React.FC = () => {
  const [chatInput, setChatInput] = React.useState('');
  return (
    <form
      id="chatbox-form"
      onSubmit={(ev): void => {
        ev.preventDefault();
        socket.emit('chatMsg', { type: 'chat', msg: chatInput });
        setChatInput('');
      }}
    >
      <input
        data-testid="chat-input"
        type="text"
        value={chatInput}
        onChange={(ev): void => setChatInput(ev.target.value)}
      />
    </form>
  );
};
export default ChatForm;
