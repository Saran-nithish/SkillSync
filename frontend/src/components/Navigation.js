import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen,
  MessageSquare,
  Users, 
  Bot,
  Menu,
  X,
  Plus,
  Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CreateNewDropdown from './CreateNewDropdown';
import './Navigation.css';

const Navigation = ({ authModal }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('.navigation') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const navItems = isAuthenticated() ? [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge' },
    { icon: MessageSquare, label: 'Q&A Support', path: '/queries' },
    { icon: Bot, label: 'Ask AI', path: '/ask-ai' },
    { icon: Users, label: 'Community', path: '/community' }
  ] : [
    { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge' },
    { icon: MessageSquare, label: 'Q&A Support', path: '/queries' },
    { icon: Users, label: 'Community', path: '/community' }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const logoPath = isAuthenticated() ? '/dashboard' : '/knowledge';

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav className={`navigation ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="navigation-content">
          {/* Logo Section */}
          <div className="nav-section logo-section">
            <Link to={logoPath} className="logo-container">
              <div className="logo-icon">
                <Layers size={24} />
              </div>
              <div className="logo-text">
                <h2>SkillSync</h2>
                <p>Knowledge Sharing Platform</p>
              </div>
            </Link>
          </div>

          {/* Create New Button - Always visible at top */}
          {isAuthenticated() && (
            <div className="nav-section create-new-section">
              <CreateNewDropdown />
            </div>
          )}

          {/* Main Navigation Label */}
          <div className="nav-section">
            <h3 className="nav-section-title">MAIN NAVIGATION</h3>
          </div>

          {/* Navigation Items */}
          <div className="nav-items">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <item.icon className="nav-item-icon" size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Welcome Section for visitors */}
          {!isAuthenticated() && (
            <div className="nav-section visitor-welcome">
              <div className="welcome-message">
                <h3>Welcome to SkillSync</h3>
                <p>Browse our knowledge base and community discussions</p>
                <div className="visitor-actions-nav">
                  <button 
                    onClick={authModal?.openLoginModal} 
                    className="apple-btn apple-btn-primary"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={authModal?.openSignupModal} 
                    className="apple-btn apple-btn-secondary"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation; 