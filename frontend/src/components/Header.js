import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import SmartSearch from './SmartSearch';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ authModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Smart Search Section */}
        <div className="header-left">
          <SmartSearch />
        </div>

        {/* Right Section */}
        <div className="header-right">
          {isAuthenticated() ? (
            <>
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Profile */}
              <div className="user-section" ref={userMenuRef}>
                <button 
                  className="user-profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {getUserInitials()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {user?.firstName || user?.username || 'User'}
                    </span>
                    <span className="user-role">{user?.role || 'Member'}</span>
                  </div>
                  <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="user-avatar large">
                        {getUserInitials()}
                      </div>
                      <div className="user-details">
                        <span className="user-name">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user?.username || 'User'
                          }
                        </span>
                        <span className="user-email">{user?.email || 'user@skillsync.com'}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-menu">
                      <Link 
                        to="/settings" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        onClick={handleLogout} 
                        className="dropdown-item logout"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest Actions */
            <div className="guest-actions">
              <button 
                onClick={authModal?.openLoginModal}
                className="auth-btn sign-in-btn"
              >
                Sign In
              </button>
              <button 
                onClick={authModal?.openSignupModal}
                className="auth-btn sign-up-btn"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 