import React from 'react';
import Socket from '../utils/Socket';
import ChatForm from './ChatForm';
import ChatMessages, { ChatMsg } from './ChatMessages';
const Chatbox: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const socket = Socket.getSocket();
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
