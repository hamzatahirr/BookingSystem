import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const userId = sessionStorage.getItem('userId') || null;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="chat-widget">
        <button 
          className={`chat-toggle-btn ${isOpen ? 'hidden' : ''}`}
          onClick={toggleChat}
          aria-label="Open chat"
        >
          💬
        </button>

        {isOpen && (
          <ChatWindow 
            onClose={toggleChat} 
            userId={userId}
            sessionId={sessionId}
            setSessionId={setSessionId}
          />
        )}
      </div>

      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .chat-toggle-btn.hidden {
          display: none;
        }

        .chat-window {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 20px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background: #f8f9fa;
        }

        .message-bubble {
          max-width: 80%;
          margin-bottom: 12px;
          padding: 10px 14px;
          border-radius: 15px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .user-message {
          margin-left: auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bot-message {
          background: white;
          color: #333;
          border: 1px solid #e0e0e0;
          border-bottom-left-radius: 4px;
        }

        .message-content {
          word-wrap: break-word;
          white-space: pre-wrap;
          line-height: 1.4;
        }

        .message-time {
          font-size: 11px;
          margin-top: 5px;
          opacity: 0.7;
        }

        .user-message .message-time {
          text-align: right;
        }

        .typing .typing-dots {
          animation: blink 1.4s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .quick-actions {
          padding: 10px 15px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          border-top: 1px solid #e0e0e0;
          background: white;
        }

        .quick-action-btn {
          padding: 8px 12px;
          font-size: 12px;
          border: 1px solid #667eea;
          background: white;
          color: #667eea;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-action-btn:hover {
          background: #667eea;
          color: white;
        }

        .quick-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-input-form {
          display: flex;
          padding: 15px;
          border-top: 1px solid #e0e0e0;
          background: white;
        }

        .chat-input-form input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input-form input:focus {
          border-color: #667eea;
        }

        .chat-input-form button {
          width: 45px;
          height: 45px;
          margin-left: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .chat-input-form button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .chat-input-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 40px);
            right: -10px;
            height: 450px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;