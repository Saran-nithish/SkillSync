import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import KnowledgeCard from '../components/KnowledgeCard';
import CreateKnowledgeModal from '../components/CreateKnowledgeModal';
import api from '../services/api';
import './Knowledge.css';

const Knowledge = () => {
  const [knowledge, setKnowledge] = useState([]);
  const [filteredKnowledge, setFilteredKnowledge] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
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

  if (loading) {
    return <div className="loading">Loading knowledge base...</div>;
  }

  return (
    <div className="knowledge-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Knowledge Base</h1>
          <p>Share and discover knowledge, SOPs, and best practices</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Share Knowledge
        </button>
      </div>

      <div className="search-and-filters">
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
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
        </div>

        <div className="filters-section">
          <div className="filters-row">
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

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="sop">SOPs</option>
              <option value="best-practice">Best Practices</option>
              <option value="experience">Experiences</option>
            </select>

            <button 
              className="btn btn-outline"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="knowledge-results">
        <div className="results-header">
          <span className="results-count">
            {filteredKnowledge.length} knowledge items found
          </span>
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
            <div className="no-results">
              <div className="no-results-content">
                <h3>No knowledge found</h3>
                <p>Try adjusting your search terms or filters, or be the first to share knowledge on this topic!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
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