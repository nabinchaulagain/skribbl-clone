import React from 'react';
export type ChatMsg = { msg: string; type: string; username?: string };
interface ChatMessageProps {
  messages: ChatMsg[];
}
const ChatMessages: React.FC<ChatMessageProps> = ({ messages }) => {
  return (
    <div id="chatbox-messages">
      {messages.map((message, idx) => (
        <div
          key={idx}
          data-testid="chatbox-message"
          className={`msg-${message.type}`}
        >
          {!message.username && message.msg}
          {message.username && (
            <>
              <b>{message.username}:</b> {message.msg}
            </>
          )}
        </div>
      ))}
    </div>
  );
};
export default ChatMessages;
