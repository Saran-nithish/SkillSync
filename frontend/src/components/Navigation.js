import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Users, Plus } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { path: '/queries', label: 'Q&A Support', icon: MessageCircle },
    { path: '/community', label: 'Community', icon: Users },
  ];

  return (
    <nav className="navigation">
      <div className="nav-section">
        <button className="create-btn">
          <Plus size={20} />
          Create New
        </button>
      </div>
      
      <div className="nav-section">
        <h3 className="nav-title">Main Navigation</h3>
        <ul className="nav-list">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="nav-section">
        <h3 className="nav-title">Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">156</div>
            <div className="stat-label">Knowledge Items</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">23</div>
            <div className="stat-label">Open Queries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">8</div>
            <div className="stat-label">Communities</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 