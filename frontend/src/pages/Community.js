import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, BookOpen, TrendingUp, Calendar, User } from 'lucide-react';
import api from '../services/api';
import './Community.css';

const Community = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityKnowledge, setCommunityKnowledge] = useState([]);
  const [communityQueries, setCommunityQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      fetchCommunityData(selectedCommunity.project);
    }
  }, [selectedCommunity]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/communities');
      setCommunities(response.data);
      if (response.data.length > 0) {
        setSelectedCommunity(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityData = async (project) => {
    try {
      const [knowledgeRes, queriesRes] = await Promise.all([
        api.get(`/knowledge?project=${encodeURIComponent(project)}`),
        api.get(`/queries?project=${encodeURIComponent(project)}`)
      ]);
      
      setCommunityKnowledge(knowledgeRes.data.slice(0, 5));
      setCommunityQueries(queriesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching community data:', error);
    }
  };

  const CommunityCard = ({ community, isSelected, onClick }) => (
    <div 
      className={`community-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="community-header">
        <div className="community-icon">
          <Users size={24} />
        </div>
        <div className="community-info">
          <h3>{community.name}</h3>
          <p>{community.description}</p>
        </div>
      </div>
      
      <div className="community-stats">
        <div className="stat">
          <span className="stat-number">{community.members.length}</span>
          <span className="stat-label">Members</span>
        </div>
      </div>
      
      <div className="community-members">
        <div className="members-list">
          {community.members.slice(0, 3).map((member, index) => (
            <div key={index} className="member-avatar">
              <User size={16} />
            </div>
          ))}
          {community.members.length > 3 && (
            <div className="member-count">+{community.members.length - 3}</div>
          )}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ type, title, author, date, status }) => (
    <div className="activity-item">
      <div className="activity-icon">
        {type === 'knowledge' ? <BookOpen size={16} /> : <MessageSquare size={16} />}
      </div>
      <div className="activity-content">
        <h4>{title}</h4>
        <div className="activity-meta">
          <span>by {author}</span>
          <span>•</span>
          <span>{new Date(date).toLocaleDateString()}</span>
          {status && <span className={`status-badge ${status}`}>{status}</span>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading communities...</div>;
  }

  return (
    <div className="community-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Community Collaboration</h1>
          <p>Connect with project teams and share knowledge within your communities</p>
        </div>
      </div>

      <div className="community-layout">
        <div className="communities-sidebar">
          <h2>Your Communities</h2>
          <div className="communities-list">
            {communities.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                isSelected={selectedCommunity?.id === community.id}
                onClick={() => setSelectedCommunity(community)}
              />
            ))}
          </div>
        </div>

        <div className="community-content">
          {selectedCommunity ? (
            <>
              <div className="community-overview">
                <div className="overview-header">
                  <h2>{selectedCommunity.name}</h2>
                  <div className="overview-stats">
                    <div className="stat-card">
                      <BookOpen className="stat-icon" size={20} />
                      <div>
                        <span className="stat-number">{communityKnowledge.length}</span>
                        <span className="stat-label">Knowledge Items</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <MessageSquare className="stat-icon" size={20} />
                      <div>
                        <span className="stat-number">{communityQueries.length}</span>
                        <span className="stat-label">Active Queries</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <Users className="stat-icon" size={20} />
                      <div>
                        <span className="stat-number">{selectedCommunity.members.length}</span>
                        <span className="stat-label">Members</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="community-description">
                  <p>{selectedCommunity.description}</p>
                </div>

                <div className="community-members-section">
                  <h3>Team Members</h3>
                  <div className="members-grid">
                    {selectedCommunity.members.map((member, index) => (
                      <div key={index} className="member-card">
                        <div className="member-avatar large">
                          <User size={20} />
                        </div>
                        <span className="member-name">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="community-activities">
                <div className="activities-section">
                  <div className="section-header">
                    <h3>Recent Knowledge</h3>
                    <a href="/knowledge" className="view-all">View All</a>
                  </div>
                  <div className="activities-list">
                    {communityKnowledge.length > 0 ? (
                      communityKnowledge.map(item => (
                        <ActivityItem
                          key={item.id}
                          type="knowledge"
                          title={item.title}
                          author={item.author}
                          date={item.createdAt}
                        />
                      ))
                    ) : (
                      <div className="no-activity">
                        <p>No recent knowledge shared in this community.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="activities-section">
                  <div className="section-header">
                    <h3>Recent Q&A</h3>
                    <a href="/queries" className="view-all">View All</a>
                  </div>
                  <div className="activities-list">
                    {communityQueries.length > 0 ? (
                      communityQueries.map(query => (
                        <ActivityItem
                          key={query.id}
                          type="query"
                          title={query.question}
                          author={query.author}
                          date={query.createdAt}
                          status={query.status}
                        />
                      ))
                    ) : (
                      <div className="no-activity">
                        <p>No recent questions in this community.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-community-selected">
              <Users size={64} className="no-community-icon" />
              <h3>Welcome to Communities</h3>
              <p>Select a community from the sidebar to view project-specific collaboration and knowledge sharing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community; 