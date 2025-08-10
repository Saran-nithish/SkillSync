import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ArrowRight,
  BarChart3,
  Bookmark,
  Sparkles,
  Brain,
  Trophy,
  Zap,
  Eye,
  Heart,
  Star,
  CheckCircle,
  Play,
  Flame,
  Library,
  HelpCircle,
  UserCheck,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreateKnowledgeModal from '../components/CreateKnowledgeModal';
import CreateQueryModal from '../components/CreateQueryModal';
import './Dashboard.css';

const Dashboard = ({ authModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const stats = [
    { 
      icon: Library, 
      label: 'Total Knowledge', 
      value: '156', 
      change: '+12% this week', 
      color: 'blue',
      trend: 'up'
    },
    { 
      icon: HelpCircle, 
      label: 'Open Queries', 
      value: '23', 
      change: '+5% this week', 
      color: 'orange',
      trend: 'up'
    },
    { 
      icon: UserCheck, 
      label: 'Communities', 
      value: '8', 
      change: '+2 new', 
      color: 'green',
      trend: 'up'
    },
    { 
      icon: Award, 
      label: 'My Contributions', 
      value: '42', 
      change: '+8 this month', 
      color: 'purple',
      trend: 'up'
    }
  ];

  const recentKnowledge = [
    {
      id: 1,
      title: 'Client Onboarding Process',
      category: 'Project Management',
      author: 'Mike Johnson',
      date: '20/01/2024',
      views: 8,
      type: 'CERTIFIED',
      icon: CheckCircle
    },
    {
      id: 2,
      title: 'React Component Best Practices',
      category: 'Frontend Development',
      author: 'John Doe',
      date: '15/01/2024',
      views: 16,
      type: 'BEST PRACTICE',
      icon: Star
    },
    {
      id: 3,
      title: 'Database Connection SOP',
      category: 'Backend Development',
      author: 'Jane Smith',
      date: '10/01/2024',
      views: 23,
      type: 'SOP',
      icon: Bookmark
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'knowledge',
      title: 'Updated "React Performance Guide"',
      author: 'You',
      time: '2 hours ago',
      icon: Sparkles,
      color: 'blue'
    },
    {
      id: 2,
      type: 'query',
      title: 'Answered "How to deploy Node.js apps?"',
      author: 'You',
      time: '4 hours ago',
      icon: Brain,
      color: 'green'
    },
    {
      id: 3,
      type: 'community',
      title: 'Joined "Frontend Developers" community',
      author: 'Sarah Chen',
      time: '6 hours ago',
      icon: Heart,
      color: 'purple'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Earned "Knowledge Expert" badge',
      author: 'You',
      time: '1 day ago',
      icon: Trophy,
      color: 'orange'
    }
  ];

  const quickActions = [
    { 
      icon: Sparkles, 
      label: 'Share Knowledge', 
      description: 'Create articles, SOPs, and best practices',
      action: 'knowledge', 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Brain, 
      label: 'Ask Question', 
      description: 'Get help from your colleagues',
      action: 'query', 
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      icon: Heart, 
      label: 'Join Community', 
      description: 'Connect with teams and experts',
      action: 'community', 
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      icon: BarChart3, 
      label: 'View Analytics', 
      description: 'Track knowledge sharing metrics',
      action: 'analytics', 
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'knowledge':
        setActiveModal('knowledge');
        break;
      case 'query':
        setActiveModal('query');
        break;
      case 'community':
        navigate('/community');
        break;
      case 'analytics':
        // Navigate to analytics page when it's available
        console.log('Analytics feature coming soon');
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleKnowledgeSubmit = async (knowledgeData) => {
    try {
      console.log('Knowledge shared successfully:', knowledgeData);
      closeModal();
    } catch (error) {
      console.error('Error sharing knowledge:', error);
    }
  };

  const handleQuerySubmit = async (queryData) => {
    try {
      console.log('Question submitted successfully:', queryData);
      closeModal();
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName || user?.username || 'User'}! 🚀</h1>
            <p>Here's what's happening with your knowledge sharing today.</p>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <Flame size={20} />
              <span>+12% this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-header">
                <div className="stat-icon-wrapper">
                  <stat.icon className="stat-icon" size={24} />
                </div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <div className="card-header">
            <div className="header-icon">
              <Zap size={20} />
            </div>
            <div className="header-text">
              <h3>Quick Actions</h3>
              <p>Get started with common tasks</p>
            </div>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`quick-action-btn ${action.color}`}
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="action-icon-wrapper">
                  <action.icon className="action-icon" size={24} />
                </div>
                <div className="action-content">
                  <div className="action-title">{action.label}</div>
                  <div className="action-description">{action.description}</div>
                </div>
                <ArrowRight className="action-arrow" size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Knowledge */}
        <div className="dashboard-card recent-knowledge-card">
          <div className="card-header">
            <div className="header-icon">
              <Bookmark size={20} />
            </div>
            <div className="header-text">
              <h3>Recent Knowledge</h3>
              <p>Latest shared knowledge and insights</p>
            </div>
            <button className="view-all-btn">
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="knowledge-list">
            {recentKnowledge.map((item, index) => (
              <div key={item.id} className="knowledge-item">
                <div className="knowledge-header">
                  <div className="knowledge-icon">
                    <item.icon size={16} />
                  </div>
                  <div className={`knowledge-type ${item.type.toLowerCase().replace(' ', '-')}`}>
                    {item.type}
                  </div>
                  <div className="knowledge-views">
                    <Eye size={14} />
                    {item.views}
                  </div>
                </div>
                <h4 className="knowledge-title">{item.title}</h4>
                <div className="knowledge-meta">
                  <span className="knowledge-category">{item.category}</span>
                  <span className="knowledge-author">{item.author}</span>
                  <span className="knowledge-date">
                    <Calendar size={12} />
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <div className="card-header">
            <div className="header-icon">
              <Play size={20} />
            </div>
            <div className="header-text">
              <h3>Recent Activity</h3>
              <p>Stay updated with latest changes</p>
            </div>
            <button className="view-all-btn">
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.color}`}>
                  <activity.icon size={18} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-meta">
                    <span className="activity-author">{activity.author}</span>
                    <span className="activity-time">
                      <Clock size={12} />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'knowledge' && (
        <CreateKnowledgeModal
          onClose={closeModal}
          onSubmit={handleKnowledgeSubmit}
          projects={['Project Alpha', 'Project Beta', 'Project Gamma']}
          categories={['Technical', 'Process', 'Best Practice', 'Training']}
        />
      )}

      {activeModal === 'query' && (
        <CreateQueryModal
          onClose={closeModal}
          onSubmit={handleQuerySubmit}
          projects={['Project Alpha', 'Project Beta', 'Project Gamma']}
        />
      )}
    </div>
  );
};

export default Dashboard; 