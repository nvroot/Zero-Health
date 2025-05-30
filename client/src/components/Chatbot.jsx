import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (historyLoaded) return;
      
      console.log('🔄 Starting chat history load process...');
      
      try {
        const userData = localStorage.getItem('user');
        console.log('📦 userData from localStorage:', userData);
        
        const token = userData ? JSON.parse(userData).token : null;
        console.log('🔑 Token extracted:', token ? 'Present' : 'Missing');
        
        if (!token) {
          console.log('❌ No token found, showing initial greeting');
          // If no token, show initial greeting
          setMessages([{
            id: 1,
            text: "Hello! I'm your Zero Health AI assistant. I can help you with health questions, appointments, medical records, and more. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date()
          }]);
          setHistoryLoaded(true);
          return;
        }
        
        console.log('🌐 Making request to chat history endpoint...');
        const response = await fetch('http://localhost:5000/api/chatbot/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('📡 Chat history response status:', response.status);
        console.log('📡 Chat history response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Chat history data received:', data);
          console.log('📊 Number of messages:', data.messages ? data.messages.length : 0);
          
          if (data.messages && data.messages.length > 0) {
            console.log('✅ Loading', data.messages.length, 'chat history messages');
            // Show chat history with welcome back message
            // Convert string timestamps to Date objects
            const messagesWithDateObjects = data.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            
            setMessages([
              {
                id: 'welcome-back',
                text: "Welcome back! Here's your conversation history:",
                sender: 'bot',
                timestamp: new Date()
              },
              ...messagesWithDateObjects
            ]);
            console.log('✅ Chat history messages set successfully');
          } else {
            console.log('📭 No chat history found, showing initial greeting');
            // No chat history, show initial greeting
            setMessages([{
              id: 'initial-greeting',
              text: "Hello! I'm your Zero Health AI assistant. I can help you with health questions, appointments, medical records, and more. How can I assist you today?",
              sender: 'bot',
              timestamp: new Date()
            }]);
          }
        } else {
          console.log('❌ Error response from chat history API:', response.status, response.statusText);
          const errorText = await response.text();
          console.log('❌ Error response body:', errorText);
          // Error loading history, show initial greeting
          setMessages([{
            id: 'error-greeting',
            text: "Hello! I'm your Zero Health AI assistant. I can help you with health questions, appointments, medical records, and more. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('💥 Failed to load chat history:', error);
        // Error loading history, show initial greeting
        setMessages([{
          id: 'fallback-greeting',
          text: "Hello! I'm your Zero Health AI assistant. I can help you with health questions, appointments, medical records, and more. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date()
        }]);
      } finally {
        console.log('🏁 Chat history loading process completed');
        setHistoryLoaded(true);
      }
    };

    loadChatHistory();
  }, [historyLoaded]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const userData = localStorage.getItem('user');
      const token = userData ? JSON.parse(userData).token : null;
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage
        })
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    if (!text) return '';
    
    let formatted = text;
    
    // Handle code blocks first (```...```)
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre><code>$1</code></pre></div>');
    
    // Handle inline code (`...`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Enhanced markdown formatting
    formatted = formatted
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold + italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
      .replace(/~~(.+?)~~/g, '<del>$1</del>') // Strikethrough
      .replace(/__(.+?)__/g, '<u>$1</u>'); // Underline
    
    // Handle medical record formatting (Record 1:, Record 2:, etc.)
    formatted = formatted.replace(/\*\*Record (\d+):\*\*/g, '<div class="record-header">📋 Medical Record $1</div>');
    
    // Handle medication formatting
    formatted = formatted.replace(/(\d+\.\s+Medication:?\s*)(.*?)(?=\n|$)/g, '<div class="medication-item"><span class="medication-number">$1</span><span class="medication-name">$2</span></div>');
    
    // Handle dosage, frequency, status info
    formatted = formatted.replace(/(-\s*)(Dosage|Frequency|Status|Duration|Instructions):\s*(.*?)(?=\n|$)/gm, 
      '<div class="medication-detail"><span class="detail-label">$2:</span> <span class="detail-value">$3</span></div>');
    
    // Handle general field formatting (- field: value)
    formatted = formatted.replace(/^-\s*([^:]+):\s*(.*)$/gm, 
      '<div class="field-item"><span class="field-label">$1:</span> <span class="field-value">$2</span></div>');
    
    // Handle numbered lists
    formatted = formatted.replace(/^(\d+)\.\s*(.*)$/gm, '<div class="numbered-item"><span class="number-badge">$1</span><span class="item-content">$2</span></div>');
    
    // Handle bullet points with various bullet styles
    formatted = formatted.replace(/^[•▪▫‣⁃]\s*(.*)$/gm, '<div class="bullet-item"><span class="bullet">•</span><span class="bullet-content">$1</span></div>');
    
    // Handle section headers (text with colons at start of line)
    formatted = formatted.replace(/^([A-Z][A-Z\s]{2,}):$/gm, '<div class="section-header">$1</div>');
    
    // Handle service categories and titles
    formatted = formatted.replace(/^(\d+)\.\s*\*\*([^*]+)\*\*:?\s*(.*)$/gm, 
      '<div class="service-item"><span class="service-number">$1</span><span class="service-title">$2</span><span class="service-description">$3</span></div>');
    
    // Handle Q&A formatting
    formatted = formatted.replace(/^Q:\s*(.*)$/gm, '<div class="question"><span class="q-label">Q:</span> $1</div>');
    formatted = formatted.replace(/^A:\s*(.*)$/gm, '<div class="answer"><span class="a-label">A:</span> $1</div>');
    
    // Handle error formatting
    formatted = formatted.replace(/(\*\*SQL Error:\*\*\s*)(.*?)(\n|$)/g, 
      '<div class="error-message"><span class="error-label">SQL Error:</span> <code class="error-code">$2</code></div>');
    formatted = formatted.replace(/(\*\*Query:\*\*\s*)(.*?)(\n|$)/g, 
      '<div class="query-display"><span class="query-label">Query:</span> <code class="sql-query">$2</code></div>');
    
    // Handle success messages with checkmarks
    formatted = formatted.replace(/(✅\s*.*?)(\n|$)/g, '<div class="success-message">$1</div>');
    
    // Handle warning/info messages
    formatted = formatted.replace(/(⚠️\s*.*?)(\n|$)/g, '<div class="warning-message">$1</div>');
    formatted = formatted.replace(/(ℹ️\s*.*?)(\n|$)/g, '<div class="info-message">$1</div>');
    
    // Handle results section
    formatted = formatted.replace(/(\*\*Results:\*\*)/g, '<div class="results-header"><span class="results-icon">📊</span>Results</div>');
    
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    // Clean up multiple consecutive <br> tags
    formatted = formatted.replace(/(<br\s*\/?>){3,}/g, '<br /><br />');
    
    return formatted;
  };

  return (
    <>
      {/* Floating chat button */}
      <div 
        className={`chat-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-icon">🤖</span>
              Zero Health AI Assistant
            </div>
            <div className="chat-status">
              <span className="status-indicator"></span>
              Online
              <button 
                onClick={() => { setHistoryLoaded(false); setMessages([]); }} 
                style={{marginLeft: '10px', padding: '2px 6px', fontSize: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer'}}
                title="Debug: Reload History"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessage(message.text) 
                    }}
                  />
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="quick-suggestions">
              <button 
                onClick={() => setInputMessage('What services does Zero Health provide?')}
                className="suggestion-btn"
              >
                Our Services
              </button>
              <button 
                onClick={() => setInputMessage('Help me book an appointment')}
                className="suggestion-btn"
              >
                Book Appointment
              </button>
              <button 
                onClick={() => setInputMessage('Show my medical records')}
                className="suggestion-btn"
              >
                Medical Records
              </button>
            </div>
            
            <div className="chat-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="2"
                maxLength="2000"
              />
              <button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="send-button"
              >
                <span>➤</span>
              </button>
            </div>
            
            <div className="chat-footer">
              <small>AI responses may contain errors. For emergencies, call 911.</small>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 