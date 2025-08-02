import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, MessageCircle, Users, Clock } from 'lucide-react';
import KnowledgeCard from '../components/KnowledgeCard';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [recentKnowledge, setRecentKnowledge] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const [stats, setStats] = useState({
    totalKnowledge: 0,
    openQueries: 0,
    communities: 0,
    myContributions: 0
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [knowledgeRes, queriesRes, communitiesRes] = await Promise.all([
        api.get('/knowledge?limit=6'),
        api.get('/queries?limit=5'),
        api.get('/communities')
      ]);
      
      setRecentKnowledge(knowledgeRes.data.slice(0, 3));
      setRecentQueries(queriesRes.data);
      setStats({
        totalKnowledge: knowledgeRes.data.length,
        openQueries: queriesRes.data.filter(q => q.status === 'pending').length,
        communities: communitiesRes.data.length,
        myContributions: knowledgeRes.data.filter(k => k.author === 'John Doe').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {trend && <span className="trend positive">+{trend}% this week</span>}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, John! 👋</h1>
        <p>Here's what's happening with your knowledge sharing today.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={BookOpen} 
          title="Total Knowledge" 
          value={stats.totalKnowledge} 
          trend={12}
        />
        <StatCard 
          icon={MessageCircle} 
          title="Open Queries" 
          value={stats.openQueries}
        />
        <StatCard 
          icon={Users} 
          title="Communities" 
          value={stats.communities}
        />
        <StatCard 
          icon={TrendingUp} 
          title="My Contributions" 
          value={stats.myContributions} 
          trend={8}
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Knowledge</h2>
            <a href="/knowledge" className="view-all">View All</a>
          </div>
          <div className="knowledge-grid">
            {recentKnowledge.map(item => (
              <KnowledgeCard key={item.id} knowledge={item} />
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Q&A Activity</h2>
            <a href="/queries" className="view-all">View All</a>
          </div>
          <div className="queries-list">
            {recentQueries.map(query => (
              <div key={query.id} className="query-item">
                <div className="query-content">
                  <h4>{query.question}</h4>
                  <div className="query-meta">
                    <span className="author">Asked by {query.author}</span>
                    <span className="status">{query.status}</span>
                    <span className="time">
                      <Clock size={14} />
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`status-badge ${query.status}`}>
                  {query.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 