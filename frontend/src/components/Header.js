import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <h2>SkillSync</h2>
          <span className="tagline">Knowledge Sharing Platform</span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search knowledge, SOPs, experiences..." 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <User size={20} />
          <span>John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 