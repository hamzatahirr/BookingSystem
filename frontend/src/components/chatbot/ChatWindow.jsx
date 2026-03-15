import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const GREETING_MESSAGE = 'Hello! 👋 I\'m Artcraft Travel Assistant. How can I help you today?';

const ChatWindow = ({ onClose, userId, sessionId, setSessionId }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: GREETING_MESSAGE, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showOptions, setShowOptions] = useState(true);
  const [quickActions, setQuickActions] = useState([
    { label: '🔍 Search Tickets', query: 'Search tickets' },
    { label: '📋 My Bookings', query: 'Show my bookings' },
    { label: '❌ Cancel Ticket', query: 'Cancel my booking' },
    { label: '❓ Help', query: 'Help' }
  ]);

  useEffect(() => {
    loadChatHistory();
    loadQuickActions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    const storedSessionId = sessionStorage.getItem('chatSessionId');
    
    if (storedSessionId) {
      try {
        const response = await axios.get(`${API_URL}/chat/${storedSessionId}`);
        if (response.data && response.data.messages && response.data.messages.length > 0) {
          const loadedMessages = response.data.messages.map(msg => ({
            sender: msg.role === 'user' ? 'user' : 'bot',
            text: msg.content,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages([
            { sender: 'bot', text: GREETING_MESSAGE, timestamp: new Date() },
            ...loadedMessages
          ]);
          setSessionId(storedSessionId);
          setShowOptions(false);
          return;
        }
      } catch (error) {
        console.log('No existing chat history found');
      }
    }
    
    if (!sessionId && storedSessionId) {
      setSessionId(storedSessionId);
    }
  };

  const loadQuickActions = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/cities`);
      const cities = response.data.cities || [];
      
      if (cities.length >= 2) {
        const randomCity1 = cities[Math.floor(Math.random() * cities.length)];
        let randomCity2 = cities[Math.floor(Math.random() * cities.length)];
        while (randomCity2 === randomCity1 && cities.length > 1) {
          randomCity2 = cities[Math.floor(Math.random() * cities.length)];
        }

        setQuickActions([
          { label: '🔍 Search Tickets', query: 'I want to search for bus tickets' },
          { label: '📋 My Bookings', query: 'Show my bookings' },
          { label: '❌ Cancel Ticket', query: 'Cancel my booking' },
          { label: '❓ Help', query: 'Help' }
        ]);
      } else {
        setQuickActions([
          { label: '🔍 Search Tickets', query: 'I want to search for bus tickets' },
          { label: '📋 My Bookings', query: 'Show my bookings' },
          { label: '❌ Cancel Ticket', query: 'Cancel my booking' },
          { label: '❓ Help', query: 'Help' }
        ]);
      }
    } catch (error) {
      setQuickActions([
        { label: '🔍 Search Tickets', query: 'I want to search for bus tickets' },
        { label: '📋 My Bookings', query: 'Show my bookings' },
        { label: '❌ Cancel Ticket', query: 'Cancel my booking' },
        { label: '❓ Help', query: 'Help' }
      ]);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowOptions(false);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: text,
        sessionId: sessionId || null,
        userId: userId || null
      });

      if (response.data.sessionId) {
        setSessionId(response.data.sessionId);
        sessionStorage.setItem('chatSessionId', response.data.sessionId);
      }

      const botMessage = {
        sender: 'bot',
        text: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Artcraft Assistant</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {loading && (
          <div className="message-bubble bot-message">
            <div className="message-content typing">
              <span className="typing-dots">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showOptions && (
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action.query)}
              disabled={loading}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;