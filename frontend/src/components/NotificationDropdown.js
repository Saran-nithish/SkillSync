import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  MessageCircle, 
  BookOpen, 
  Users, 
  AtSign,
  Check,
  Trash2,
  X,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      MessageCircle,
      BookOpen,
      Users,
      AtSign,
      Bell
    };
    const IconComponent = icons[iconName] || Bell;
    return <IconComponent size={16} />;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--color-error)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-secondary)';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation();
    markAsRead(notificationId);
  };

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button 
                className="header-action"
                onClick={() => navigate('/settings')}
                title="Notification Settings"
              >
                <Settings size={16} />
              </button>
              {unreadCount > 0 && (
                <button 
                  className="header-action"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  className="header-action"
                  onClick={clearAllNotifications}
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="notification-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={32} />
                <p>No notifications</p>
                <span>You're all caught up!</span>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.icon)}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                      <div 
                        className="priority-indicator"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      />
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      {notification.actionUrl && (
                        <ExternalLink size={12} className="external-link-icon" />
                      )}
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="action-btn mark-read"
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={(e) => handleDelete(e, notification.id)}
                      title="Delete"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="notification-footer">
              <button 
                className="view-all-btn"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 