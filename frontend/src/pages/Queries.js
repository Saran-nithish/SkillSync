import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, CheckCircle, Clock, User, Calendar, Bot, Sparkles, HelpCircle, Filter, TrendingUp, Users, Zap } from 'lucide-react';
import CreateQueryModal from '../components/CreateQueryModal';
import AnswerQueryModal from '../components/AnswerQueryModal';
import { useAuth } from '../contexts/AuthContext';
import { queryAPI, knowledgeAPI } from '../services/api';
import './Queries.css';

const Queries = ({ authModal }) => {
  const { isAuthenticated } = useAuth();
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  // Stats for dashboard-like view
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    answered: 0,
    aiAssisted: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
    updateStats();
  }, [queries, searchTerm, selectedStatus, selectedProject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [queriesRes, projectsRes] = await Promise.all([
        queryAPI.getAll(),
        knowledgeAPI.getProjects()
      ]);
      
      setQueries(queriesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = filteredQueries.length;
    const pending = filteredQueries.filter(q => q.status === 'pending').length;
    const answered = filteredQueries.filter(q => q.status === 'answered').length;
    const aiAssisted = filteredQueries.filter(q => q.aiAnswer).length;

    setStats({ total, pending, answered, aiAssisted });
  };

  const applyFilters = () => {
    let filtered = [...queries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(query =>
        query.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
      const response = await queryAPI.create(newQuery);
      setQueries(prev => [response.data, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating query:', error);
    }
  };

  const handleAnswerQuery = async (queryId, answerData) => {
    try {
      const response = await queryAPI.answer(queryId, answerData);
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

  const handleGetAIAnswer = async (queryId) => {
    if (!isAuthenticated()) {
      authModal?.openLoginModal();
      return;
    }
    
    try {
      setGeneratingAI(queryId);
      const response = await queryAPI.getAIAnswer(queryId);
      setQueries(prev => 
        prev.map(query => 
          query.id === queryId ? response.data : query
        )
      );
    } catch (error) {
      console.error('Error getting AI answer:', error);
    } finally {
      setGeneratingAI(null);
    }
  };

  const openAnswerModal = (query) => {
    setSelectedQuery(query);
    setShowAnswerModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedProject('');
  };

  const hasActiveFilters = searchTerm || selectedStatus || selectedProject;

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
    return (
      <div className="queries-loading">
        <div className="loading-spinner"></div>
        <p>Loading Q&A Support...</p>
      </div>
    );
  }

  return (
    <div className="queries-page">
      {/* Hero Section */}
      <div className="queries-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <HelpCircle className="hero-icon" size={32} />
              Q&A Support
            </h1>
            <p>Ask questions, get answers, and collaborate with your team and AI assistance</p>
          </div>
          <button 
            className="btn-hero"
            onClick={() => {
              if (isAuthenticated()) {
                setShowCreateModal(true);
              } else {
                authModal?.openLoginModal();
              }
            }}
          >
            <Plus size={20} />
            Ask Question
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Questions</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.answered}</div>
              <div className="stat-label">Answered</div>
            </div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">
              <Bot size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.aiAssisted}</div>
              <div className="stat-label">AI Assisted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="queries-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search questions by content, project, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="controls-actions">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && <span className="filter-badge">{
              [searchTerm, selectedStatus, selectedProject].filter(Boolean).length
            }</span>}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="answered">Answered</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Project</label>
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
            </div>

            {hasActiveFilters && (
              <button 
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="queries-results">
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              {filteredQueries.length} {filteredQueries.length === 1 ? 'question' : 'questions'} found
            </span>
            {hasActiveFilters && (
              <span className="filters-applied">
                • Filters applied
              </span>
            )}
          </div>
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
                    <span className="project-label">Project:</span>
                    <span className="project-name">{query.project}</span>
                  </div>
                </div>

                <div className="query-content">
                  <h3 className="query-question">{query.question}</h3>
                  
                  {query.aiAnswer && (
                    <div className="ai-answer-section">
                      <div className="ai-answer-header">
                        <Bot size={16} />
                        <span>AI Answer</span>
                        <div className="ai-badge">
                          <Sparkles size={12} />
                          AI
                        </div>
                      </div>
                      <div className="ai-answer-content">
                        <p>{query.aiAnswer}</p>
                        <small className="ai-disclaimer">
                          This AI answer is based on your team's knowledge base. 
                          Please verify important information with team members.
                        </small>
                      </div>
                    </div>
                  )}
                  
                  {query.answer && (
                    <div className="query-answer">
                      <div className="answer-header">
                        <Users size={16} />
                        <span>Team Answer</span>
                      </div>
                      <div className="answer-content">
                        <p>{query.answer}</p>
                        <div className="answer-meta">
                          <span>Answered by <strong>{query.answeredBy}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="query-footer">
                  <div className="query-meta">
                    <div className="author-info">
                      <User size={14} />
                      <span>Asked by <strong>{query.author}</strong></span>
                    </div>
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="query-actions">
                    {query.status === 'pending' && !query.aiAnswer && (
                      <button 
                        className="btn-ai"
                        onClick={() => handleGetAIAnswer(query.id)}
                        disabled={generatingAI === query.id}
                      >
                        {generatingAI === query.id ? (
                          <>
                            <div className="loading-spinner small"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Zap size={16} />
                            Get AI Answer
                          </>
                        )}
                      </button>
                    )}
                    
                    {query.status === 'pending' && (
                      <button 
                        className="btn-answer"
                        onClick={() => {
                          if (isAuthenticated()) {
                            openAnswerModal(query);
                          } else {
                            authModal?.openLoginModal();
                          }
                        }}
                      >
                        <MessageSquare size={16} />
                        Answer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <HelpCircle size={48} />
              </div>
              <h3>No questions found</h3>
              <p>
                {hasActiveFilters 
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Be the first to ask a question and get help from your team!"
                }
              </p>
              <div className="empty-actions">
                {hasActiveFilters && (
                  <button 
                    className="btn-outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
                <button 
                  className="btn-primary"
                  onClick={() => {
                    if (isAuthenticated()) {
                      setShowCreateModal(true);
                    } else {
                      authModal?.openLoginModal();
                    }
                  }}
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
          isOpen={true}
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