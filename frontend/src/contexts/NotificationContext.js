import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('skillsync-notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('skillsync-notification-settings');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      communityUpdates: true,
      knowledgeUpdates: true,
      queryAnswers: true,
      mentions: true
    };
  });

  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('skillsync-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('skillsync-notification-settings', JSON.stringify(settings));
  }, [settings]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Notification types
  const createQueryAnswerNotification = (queryTitle, answerBy) => {
    if (!settings.queryAnswers) return;
    
    return addNotification({
      type: 'query_answer',
      title: 'Your question was answered',
      message: `${answerBy} answered your question: "${queryTitle}"`,
      icon: 'MessageCircle',
      actionUrl: '/queries',
      priority: 'high'
    });
  };

  const createKnowledgeUpdateNotification = (knowledgeTitle) => {
    if (!settings.knowledgeUpdates) return;
    
    return addNotification({
      type: 'knowledge_update',
      title: 'New knowledge article',
      message: `New article published: "${knowledgeTitle}"`,
      icon: 'BookOpen',
      actionUrl: '/knowledge',
      priority: 'medium'
    });
  };

  const createCommunityUpdateNotification = (communityName, updateType) => {
    if (!settings.communityUpdates) return;
    
    return addNotification({
      type: 'community_update',
      title: 'Community activity',
      message: `New ${updateType} in ${communityName}`,
      icon: 'Users',
      actionUrl: '/community',
      priority: 'low'
    });
  };

  const createMentionNotification = (mentionedBy, context) => {
    if (!settings.mentions) return;
    
    return addNotification({
      type: 'mention',
      title: 'You were mentioned',
      message: `${mentionedBy} mentioned you in ${context}`,
      icon: 'AtSign',
      actionUrl: '/queries',
      priority: 'high'
    });
  };

  const createSystemNotification = (title, message) => {
    return addNotification({
      type: 'system',
      title,
      message,
      icon: 'Bell',
      priority: 'medium'
    });
  };

  // Simulate some initial notifications for demo
  useEffect(() => {
    if (notifications.length === 0) {
      const demoNotifications = [
        {
          id: 1,
          type: 'query_answer',
          title: 'Your question was answered',
          message: 'John Doe answered your question: "How to implement authentication?"',
          icon: 'MessageCircle',
          actionUrl: '/queries',
          priority: 'high',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false
        },
        {
          id: 2,
          type: 'knowledge_update',
          title: 'New knowledge article',
          message: 'New article published: "React Best Practices Guide"',
          icon: 'BookOpen',
          actionUrl: '/knowledge',
          priority: 'medium',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          read: false
        },
        {
          id: 3,
          type: 'community_update',
          title: 'Community activity',
          message: 'New discussion in Frontend Developers',
          icon: 'Users',
          actionUrl: '/community',
          priority: 'low',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          read: true
        },
        {
          id: 4,
          type: 'system',
          title: 'Welcome to SkillSync!',
          message: 'Start exploring our knowledge base and connect with your team',
          icon: 'Bell',
          priority: 'medium',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
          read: false
        }
      ];

      setNotifications(demoNotifications);
    }
  }, []);

  const value = {
    notifications,
    settings,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    createQueryAnswerNotification,
    createKnowledgeUpdateNotification,
    createCommunityUpdateNotification,
    createMentionNotification,
    createSystemNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 