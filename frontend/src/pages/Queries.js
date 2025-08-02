import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, CheckCircle, Clock, User, Calendar } from 'lucide-react';
import CreateQueryModal from '../components/CreateQueryModal';
import AnswerQueryModal from '../components/AnswerQueryModal';
import api from '../services/api';
import './Queries.css';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  
  // Filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [queries, selectedStatus, selectedProject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [queriesRes, projectsRes] = await Promise.all([
        api.get('/queries'),
        api.get('/projects')
      ]);
      
      setQueries(queriesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...queries];

    if (selectedStatus) {
      filtered = filtered.filter(query => query.status === selectedStatus);
    }

    if (selectedProject) {
      filtered = filtered.filter(query => query.project === selectedProject);
    }

    setFilteredQueries(filtered);
  };

  const handleCreateQuery = async (newQuery) => {
    try {
      const response = await api.post('/queries', newQuery);
      setQueries(prev => [response.data, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating query:', error);
    }
  };

  const handleAnswerQuery = async (queryId, answerData) => {
    try {
      const response = await api.post(`/queries/${queryId}/answer`, answerData);
      setQueries(prev => 
        prev.map(query => 
          query.id === queryId ? response.data : query
        )
      );
      setShowAnswerModal(false);
      setSelectedQuery(null);
    } catch (error) {
      console.error('Error answering query:', error);
    }
  };

  const openAnswerModal = (query) => {
    setSelectedQuery(query);
    setShowAnswerModal(true);
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setSelectedProject('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="status-icon answered" size={16} />;
      case 'pending':
      default:
        return <Clock className="status-icon pending" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return '#10b981';
      case 'pending':
      default:
        return '#f59e0b';
    }
  };

  if (loading) {
    return <div className="loading">Loading Q&A...</div>;
  }

  return (
    <div className="queries-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Q&A Support</h1>
          <p>Ask questions and get help from your team members</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Ask Question
        </button>
      </div>

      <div className="queries-filters">
        <div className="filters-row">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="answered">Answered</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="filter-select"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>

          <button 
            className="btn btn-outline"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="queries-stats">
          <div className="stat-item">
            <span className="stat-number">{queries.filter(q => q.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{queries.filter(q => q.status === 'answered').length}</span>
            <span className="stat-label">Answered</span>
          </div>
        </div>
      </div>

      <div className="queries-container">
        <div className="queries-header">
          <span className="results-count">
            {filteredQueries.length} questions found
          </span>
        </div>

        <div className="queries-list">
          {filteredQueries.length > 0 ? (
            filteredQueries.map(query => (
              <div key={query.id} className="query-card">
                <div className="query-header">
                  <div className="query-status">
                    {getStatusIcon(query.status)}
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(query.status) + '20', color: getStatusColor(query.status) }}
                    >
                      {query.status}
                    </span>
                  </div>
                  <div className="query-project">
                    Project: {query.project}
                  </div>
                </div>

                <div className="query-content">
                  <h3 className="query-question">{query.question}</h3>
                  
                  {query.answer && (
                    <div className="query-answer">
                      <h4>Answer:</h4>
                      <p>{query.answer}</p>
                      <div className="answer-meta">
                        <span>Answered by {query.answeredBy}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="query-footer">
                  <div className="query-meta">
                    <div className="author-info">
                      <User size={14} />
                      <span>Asked by {query.author}</span>
                    </div>
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {query.status === 'pending' && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => openAnswerModal(query)}
                    >
                      <MessageSquare size={16} />
                      Answer
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <MessageSquare size={48} className="no-results-icon" />
                <h3>No questions found</h3>
                <p>Try adjusting your filters, or be the first to ask a question!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={20} />
                  Ask Question
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateQueryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateQuery}
          projects={projects}
        />
      )}

      {showAnswerModal && selectedQuery && (
        <AnswerQueryModal
          query={selectedQuery}
          onClose={() => {
            setShowAnswerModal(false);
            setSelectedQuery(null);
          }}
          onSubmit={(answerData) => handleAnswerQuery(selectedQuery.id, answerData)}
        />
      )}
    </div>
  );
};

export default Queries; 