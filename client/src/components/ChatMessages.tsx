import React from 'react';
export type ChatMsg = { msg: string; type: string };
interface ChatMessageProps {
  messages: ChatMsg[];
}
const ChatMessages: React.FC<ChatMessageProps> = ({ messages }) => {
  return (
    <div id="chatbox-messages">
      {messages.map((message, idx) => (
        <div key={idx} data-testid="chatbox-message">
          {message.msg}
        </div>
      ))}
    </div>
  );
};
export default ChatMessages;
