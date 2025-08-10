import React, { useState, useEffect } from 'react';
import { Plus, Filter, Grid, List, BookOpen, Sparkles, TrendingUp, Users } from 'lucide-react';
import KnowledgeCard from '../components/KnowledgeCard';
import CreateKnowledgeModal from '../components/CreateKnowledgeModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Knowledge.css';

const Knowledge = ({ authModal }) => {
  const { isAuthenticated } = useAuth();
  const [knowledge, setKnowledge] = useState([]);
  const [filteredKnowledge, setFilteredKnowledge] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Stats for dashboard-like view
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    recentlyAdded: 0,
    mostViewed: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
    updateStats();
  }, [knowledge, searchTerm, selectedCategory, selectedProject, selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [knowledgeRes, categoriesRes, projectsRes] = await Promise.all([
        api.get('/knowledge'),
        api.get('/categories'),
        api.get('/projects')
      ]);
      
      setKnowledge(knowledgeRes.data);
      setCategories(categoriesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = filteredKnowledge.length;
    const uniqueCategories = new Set(filteredKnowledge.map(item => item.category)).size;
    const recentlyAdded = filteredKnowledge.filter(item => {
      const itemDate = new Date(item.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate > weekAgo;
    }).length;
    
    const mostViewed = filteredKnowledge.reduce((prev, current) => 
      (prev.views > current.views) ? prev : current, filteredKnowledge[0]
    );

    setStats({ total, categories: uniqueCategories, recentlyAdded, mostViewed });
  };

  const applyFilters = () => {
    let filtered = [...knowledge];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Project filter
    if (selectedProject) {
      filtered = filtered.filter(item => item.project === selectedProject);
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredKnowledge(filtered);
  };

  const handleSearch = async (term) => {
    if (term.trim()) {
      try {
        const response = await api.get(`/knowledge?search=${encodeURIComponent(term)}`);
        setFilteredKnowledge(response.data);
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      applyFilters();
    }
  };

  const handleLike = async (knowledgeId) => {
    if (!isAuthenticated()) {
      authModal?.openLoginModal();
      return;
    }
    
    try {
      const response = await api.post(`/knowledge/${knowledgeId}/like`);
      setKnowledge(prev => 
        prev.map(item => 
          item.id === knowledgeId ? { ...item, likes: response.data.likes } : item
        )
      );
    } catch (error) {
      console.error('Error liking knowledge:', error);
    }
  };

  const handleCreateKnowledge = async (newKnowledge) => {
    try {
      const response = await api.post('/knowledge', newKnowledge);
      setKnowledge(prev => [response.data, ...prev]);
      setShowCreateModal(false);
      // Refresh categories and projects if new ones were added
      if (!categories.includes(newKnowledge.category)) {
        setCategories(prev => [...prev, newKnowledge.category]);
      }
      if (!projects.includes(newKnowledge.project)) {
        setProjects(prev => [...prev, newKnowledge.project]);
      }
    } catch (error) {
      console.error('Error creating knowledge:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedProject('');
    setSelectedType('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedProject || selectedType;

  if (loading) {
    return (
      <div className="knowledge-loading">
        <div className="loading-spinner"></div>
        <p>Loading knowledge base...</p>
      </div>
    );
  }

  return (
    <div className="knowledge-page">
      {/* Hero Section */}
      <div className="knowledge-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <BookOpen className="hero-icon" size={32} />
              Knowledge Base
            </h1>
            <p>Discover, share, and collaborate on knowledge, SOPs, and best practices</p>
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
            <Sparkles size={20} />
            Share Knowledge
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Articles</div>
            </div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">
              <Filter size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.categories}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.recentlyAdded}</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{knowledge.filter(item => item.type === 'collaborative').length}</div>
              <div className="stat-label">Collaborative</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="knowledge-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search knowledge by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
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
              [searchTerm, selectedCategory, selectedProject, selectedType].filter(Boolean).length
            }</span>}
          </button>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
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

            <div className="filter-group">
              <label>Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="sop">SOPs</option>
                <option value="best-practice">Best Practices</option>
                <option value="experience">Experiences</option>
                <option value="tutorial">Tutorials</option>
                <option value="documentation">Documentation</option>
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
      <div className="knowledge-results">
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              {filteredKnowledge.length} {filteredKnowledge.length === 1 ? 'article' : 'articles'} found
            </span>
            {hasActiveFilters && (
              <span className="filters-applied">
                • Filters applied
              </span>
            )}
          </div>
        </div>

        <div className={`knowledge-container ${viewMode}`}>
          {filteredKnowledge.length > 0 ? (
            filteredKnowledge.map(item => (
              <KnowledgeCard
                key={item.id}
                knowledge={item}
                onLike={handleLike}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <BookOpen size={48} />
              </div>
              <h3>No knowledge found</h3>
              <p>
                {hasActiveFilters 
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Be the first to share knowledge and help your team learn and grow!"
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
                  Share Knowledge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateKnowledgeModal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateKnowledge}
          categories={categories}
          projects={projects}
        />
      )}
    </div>
  );
};

export default Knowledge; 