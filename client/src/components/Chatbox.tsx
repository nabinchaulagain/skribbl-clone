import React from 'react';
import socket from '../utils/socket';
import ChatForm from './ChatForm';
import ChatMessages, { ChatMsg } from './ChatMessages';
const Chatbox: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  React.useEffect(() => {
    socket.on('chatMsg', (msg: ChatMsg) => {
      setMessages([...messages, msg]);
    });
    return () => {
      socket.removeEventListener('chatMsg');
    };
  }, [messages]);
  return (
    <div id="chatbox-container">
      <ChatMessages messages={messages}></ChatMessages>
      <ChatForm></ChatForm>
    </div>
  );
};

export default Chatbox;
