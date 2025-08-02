import React from 'react';
import { Heart, User, Calendar, Tag } from 'lucide-react';
import './KnowledgeCard.css';

const KnowledgeCard = ({ knowledge, onLike }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'sop': return '#10b981';
      case 'best-practice': return '#3b82f6';
      case 'experience': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'sop': return 'SOP';
      case 'best-practice': return 'Best Practice';
      case 'experience': return 'Experience';
      default: return 'Knowledge';
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(knowledge.id);
    }
  };

  return (
    <div className="knowledge-card">
      <div className="card-header">
        <div className="type-badge" style={{ backgroundColor: getTypeColor(knowledge.type) }}>
          {getTypeLabel(knowledge.type)}
        </div>
        <div className="category-tag">
          <Tag size={14} />
          {knowledge.category}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{knowledge.title}</h3>
        <p className="card-description">
          {knowledge.content.length > 150 
            ? `${knowledge.content.substring(0, 150)}...` 
            : knowledge.content}
        </p>
        
        <div className="card-tags">
          {knowledge.tags && knowledge.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="author-info">
          <User size={16} />
          <span>{knowledge.author}</span>
        </div>
        
        <div className="card-meta">
          <div className="date-info">
            <Calendar size={14} />
            <span>{new Date(knowledge.createdAt).toLocaleDateString()}</span>
          </div>
          
          <button 
            className="like-btn"
            onClick={handleLike}
          >
            <Heart size={16} />
            <span>{knowledge.likes || 0}</span>
          </button>
        </div>
      </div>
      
      {knowledge.project && (
        <div className="project-badge">
          Project: {knowledge.project}
        </div>
      )}
    </div>
  );
};

export default KnowledgeCard; 