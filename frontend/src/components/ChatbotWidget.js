import React, { useState, useEffect, useRef } from 'react';
import '../css/ChatbotWidget.css';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const toggleChatbot = () => setIsOpen(prev => !prev);

    useEffect(() => {
        setMessages([{ text: "Hi! I'm Trusty, your virtual AI assistant. I can help you with all things related to Trust Circle, how may I help you today?", sender: 'bot' }]);
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (input.trim() === '') return;
  
      const userMessage = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
  
      try {
          const res = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: input }),
          });
  
          const data = await res.json();
          const botMessage = { text: data.response, sender: 'bot' };
          setMessages(prev => [...prev, botMessage]);
  
      } catch (error) {
          console.error('Error talking to chatbot:', error);
          setMessages(prev => [...prev, {
              text: "Error: couldn't reach server.",
              sender: 'bot'
          }]);
      }
  };

    return (
        <div className="chatbot-container">
            <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">Trusty Assistant</div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender}`}
                        >
                            <div className="bubble">{msg.text}</div>
                        </div>
                    ))}
                    {/* Empty div to scroll into view */}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="chatbot-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
            <button className="chatbot-toggle" onClick={toggleChatbot}>
                💬
            </button>
        </div>
    );
};

export default ChatbotWidget;
