import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {message.text}
      </div>
      <div className="message-time">
        {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
};

export default MessageBubble;