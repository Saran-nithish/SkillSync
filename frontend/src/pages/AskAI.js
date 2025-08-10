import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Search, BookOpen, Globe, Sparkles, MessageCircle, Loader, Brain, Lightbulb, Code, FileText, HelpCircle, Zap, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AskAI.css';

const AskAI = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello ${user?.firstName || user?.username || 'there'}! I'm your AI assistant. I can help you find information from the knowledge base or search online for answers. What would you like to know?`,
      timestamp: new Date(),
      sources: []
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('both'); // 'knowledge', 'online', 'both'
  const messagesEndRef = useRef(null);

  // Template categories and prompts
  const templateCategories = [
    {
      id: 'quick-help',
      title: 'Quick Help',
      icon: HelpCircle,
      color: 'blue',
      templates: [
        { text: "How do I access the knowledge base?", icon: BookOpen },
        { text: "What are the company policies?", icon: FileText },
        { text: "Who should I contact for IT support?", icon: Users },
        { text: "How do I submit a request?", icon: Briefcase }
      ]
    },
    {
      id: 'technical',
      title: 'Technical',
      icon: Code,
      color: 'purple',
      templates: [
        { text: "How do I troubleshoot login issues?", icon: Zap },
        { text: "What are the system requirements?", icon: Code },
        { text: "How do I reset my password?", icon: Brain },
        { text: "Where can I find API documentation?", icon: FileText }
      ]
    },
    {
      id: 'learning',
      title: 'Learning',
      icon: Lightbulb,
      color: 'green',
      templates: [
        { text: "What training materials are available?", icon: BookOpen },
        { text: "How do I learn about new features?", icon: Sparkles },
        { text: "Where can I find best practices?", icon: Lightbulb },
        { text: "What certifications are recommended?", icon: Brain }
      ]
    },
    {
      id: 'general',
      title: 'General',
      icon: MessageCircle,
      color: 'orange',
      templates: [
        { text: "What's new in the latest update?", icon: Sparkles },
        { text: "How do I provide feedback?", icon: MessageCircle },
        { text: "What are the upcoming events?", icon: Users },
        { text: "How can I contribute to the knowledge base?", icon: BookOpen }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTemplateClick = (templateText) => {
    setQuery(templateText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date(),
      sources: []
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      // Call the Ask AI endpoint
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          question: userMessage.content,
          includeOnlineSearch: searchMode === 'online' || searchMode === 'both'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.answer,
          timestamp: new Date(),
          sources: data.sources || []
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          timestamp: new Date(),
          sources: []
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        sources: []
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `Hello ${user?.firstName || user?.username || 'there'}! I'm your AI assistant. I can help you find information from the knowledge base or search online for answers. What would you like to know?`,
        timestamp: new Date(),
        sources: []
      }
    ]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryColorClass = (color) => {
    const colorMap = {
      blue: 'category-blue',
      purple: 'category-purple', 
      green: 'category-green',
      orange: 'category-orange'
    };
    return colorMap[color] || 'category-blue';
  };

  return (
    <div className="ask-ai-page">
      {/* Hero Section */}
      <div className="ai-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <Brain className="hero-icon" size={32} />
              Ask AI Assistant
            </h1>
            <p>Get instant answers from your knowledge base and online sources with AI-powered assistance</p>
          </div>
          <div className="hero-actions">
            <div className="status-indicator">
              <div className="status-dot online"></div>
              <span>AI Online</span>
            </div>
            <button className="clear-chat-btn" onClick={clearChat}>
              <MessageCircle size={16} />
              Clear Chat
            </button>
          </div>
        </div>

        {/* Search Mode Selector */}
        <div className="mode-selector-section">
          <div className="mode-selector">
            <button
              className={`mode-btn ${searchMode === 'knowledge' ? 'active' : ''}`}
              onClick={() => setSearchMode('knowledge')}
            >
              <BookOpen size={16} />
              Knowledge Base
            </button>
            <button
              className={`mode-btn ${searchMode === 'online' ? 'active' : ''}`}
              onClick={() => setSearchMode('online')}
            >
              <Globe size={16} />
              Online Search
            </button>
            <button
              className={`mode-btn ${searchMode === 'both' ? 'active' : ''}`}
              onClick={() => setSearchMode('both')}
            >
              <Sparkles size={16} />
              Knowledge + Online
            </button>
          </div>
        </div>
      </div>

      {/* Template Categories */}
      <div className="templates-section">
        <div className="templates-header">
          <h2>Quick Start Templates</h2>
          <p>Choose a template to get started or ask your own question</p>
        </div>
        
        <div className="templates-grid">
          {templateCategories.map(category => (
            <div key={category.id} className={`template-category ${getCategoryColorClass(category.color)}`}>
              <div className="category-header">
                <div className="category-icon">
                  <category.icon size={20} />
                </div>
                <h3>{category.title}</h3>
              </div>
              
              <div className="category-templates">
                {category.templates.map((template, index) => (
                  <button
                    key={index}
                    className="template-card"
                    onClick={() => handleTemplateClick(template.text)}
                  >
                    <template.icon size={16} className="template-icon" />
                    <span>{template.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'ai' ? (
                  <Bot size={18} />
                ) : (
                  <span>{user?.firstName?.[0] || user?.username?.[0] || 'U'}</span>
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="message-sources">
                    <div className="sources-label">
                      <Search size={12} />
                      Sources:
                    </div>
                    <div className="sources-list">
                      {message.sources.map((source, index) => (
                        <span key={index} className="source-tag">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai loading-message">
              <div className="message-avatar">
                <Bot size={18} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="input-section">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="input-wrapper">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything about your knowledge base or any topic..."
                className="message-input"
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!query.trim() || isLoading}
              >
                {isLoading ? <Loader size={18} className="spinner" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskAI; 