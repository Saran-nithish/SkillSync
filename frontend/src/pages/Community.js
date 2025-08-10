import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, MessageSquare, BookOpen, Calendar, UserPlus, Settings, Activity, 
  Globe, Lock, Crown, Shield, Hash, Image, Palette, Eye, EyeOff, X, Search,
  Mail, UserCheck, Star, Trash2, Edit3, TrendingUp, Zap, Filter
} from 'lucide-react';
import { communityAPI, knowledgeAPI, queryAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Community.css';

const Community = ({ authModal }) => {
  const { isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Stats for dashboard-like view
  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalMembers: 0,
    activeCommunities: 0,
    recentActivity: 0
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      fetchCommunityData(selectedCommunity);
    }
  }, [selectedCommunity]);

  useEffect(() => {
    updateStats();
  }, [communities]);

  const updateStats = () => {
    const totalCommunities = communities.length;
    const totalMembers = communities.reduce((acc, c) => acc + c.members.length, 0);
    const activeCommunities = communities.filter(c => c.isActive).length;
    const recentActivity = communities.reduce((acc, c) => acc + (c.recentActivity || 0), 0);

    setStats({ totalCommunities, totalMembers, activeCommunities, recentActivity });
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await communityAPI.getAll();
      setCommunities(response.data);
      if (response.data.length > 0 && !selectedCommunity) {
        setSelectedCommunity(response.data[0].project);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityData = async (project) => {
    try {
      const [communityRes, knowledgeRes, queriesRes] = await Promise.all([
        communityAPI.getByProject(project),
        knowledgeAPI.getAll({ project, limit: 10 }),
        queryAPI.getAll({ project, limit: 10 })
      ]);

      setCommunityData({
        community: communityRes.data,
        knowledge: knowledgeRes.data,
        queries: queriesRes.data
      });
    } catch (error) {
      console.error('Error fetching community data:', error);
    }
  };

  const handleCreateCommunity = async (formData) => {
    try {
      const response = await communityAPI.create(formData);
      setCommunities(prev => [response.data, ...prev]);
      setSelectedCommunity(response.data.project);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!newMemberName.trim() || !communityData?.community) return;

    try {
      const response = await communityAPI.join(communityData.community.id, newMemberName.trim());
      setCommunityData(prev => ({
        ...prev,
        community: response.data
      }));
      setNewMemberName('');
      setShowJoinModal(false);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const CreateCommunityModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      project: '',
      description: '',
      privacy: 'public', // public, private, invite-only
      category: 'general',
      tags: [],
      allowMemberInvites: true,
      requireApproval: false,
      customColor: '#3b82f6',
      icon: 'users',
      welcomeMessage: '',
      rules: [],
      moderators: [],
      members: [],
      features: {
        discussions: true,
        knowledgeBase: true,
        announcements: true,
        events: false,
        fileSharing: true
      }
    });
    
    const [currentTag, setCurrentTag] = useState('');
    const [currentRule, setCurrentRule] = useState('');
    const [currentMember, setCurrentMember] = useState('');

    const privacyOptions = [
      { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can find and join this community' },
      { value: 'private', label: 'Private', icon: Lock, desc: 'Only members can see and access this community' },
      { value: 'invite-only', label: 'Invite Only', icon: Shield, desc: 'Members can only join by invitation' }
    ];

    const categoryOptions = [
      'General', 'Development', 'Design', 'Marketing', 'Sales', 'Support', 
      'HR', 'Finance', 'Operations', 'Research', 'Product', 'Engineering'
    ];

    const iconOptions = [
      { value: 'users', icon: Users },
      { value: 'hash', icon: Hash },
      { value: 'star', icon: Star },
      { value: 'crown', icon: Crown },
      { value: 'shield', icon: Shield },
      { value: 'book', icon: BookOpen },
      { value: 'message', icon: MessageSquare },
      { value: 'activity', icon: Activity }
    ];

    const addTag = () => {
      if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
        setCurrentTag('');
      }
    };

    const removeTag = (tagToRemove) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    };

    const addRule = () => {
      if (currentRule.trim()) {
        setFormData(prev => ({
          ...prev,
          rules: [...prev.rules, currentRule.trim()]
        }));
        setCurrentRule('');
      }
    };

    const removeRule = (index) => {
      setFormData(prev => ({
        ...prev,
        rules: prev.rules.filter((_, i) => i !== index)
      }));
    };

    const addMember = () => {
      if (currentMember.trim() && !formData.members.includes(currentMember.trim())) {
        setFormData(prev => ({
          ...prev,
          members: [...prev.members, currentMember.trim()]
        }));
        setCurrentMember('');
      }
    };

    const removeMember = (memberToRemove) => {
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter(member => member !== memberToRemove)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreateCommunity(formData);
    };

    const SelectedIcon = iconOptions.find(opt => opt.value === formData.icon)?.icon || Users;

    return (
      <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
        <div className="modal-content large create-community-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-section">
              <div className="community-preview-icon" style={{ background: formData.customColor }}>
                <SelectedIcon size={24} />
              </div>
              <div>
            <h2>Create New Community</h2>
                <p>Build a space for your team to collaborate and share knowledge</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="create-community-form">
            <div className="form-sections">
              {/* Basic Information */}
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
            <div className="form-group">
              <label>Community Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter community name"
                required
              />
            </div>
            <div className="form-group">
              <label>Project *</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                placeholder="Associated project name"
                required
              />
            </div>
                </div>
                
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the community's purpose and goals"
                rows="3"
              />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Custom Color</label>
                    <div className="color-input-container">
                      <input
                        type="color"
                        value={formData.customColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, customColor: e.target.value }))}
                        className="color-input"
                      />
                      <span className="color-preview" style={{ backgroundColor: formData.customColor }}></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy & Access */}
              <div className="form-section">
                <h3>Privacy & Access</h3>
                <div className="privacy-options">
                  {privacyOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <label key={option.value} className={`privacy-option ${formData.privacy === option.value ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="privacy"
                          value={option.value}
                          checked={formData.privacy === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                        />
                        <div className="privacy-option-content">
                          <div className="privacy-option-header">
                            <Icon size={20} />
                            <span className="privacy-option-label">{option.label}</span>
                          </div>
                          <p className="privacy-option-desc">{option.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="form-row">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.allowMemberInvites}
                        onChange={(e) => setFormData(prev => ({ ...prev, allowMemberInvites: e.target.checked }))}
                      />
                      <span className="checkmark"></span>
                      Allow members to invite others
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.requireApproval}
                        onChange={(e) => setFormData(prev => ({ ...prev, requireApproval: e.target.checked }))}
                      />
                      <span className="checkmark"></span>
                      Require approval to join
                    </label>
                  </div>
                </div>
              </div>

              {/* Customization */}
              <div className="form-section">
                <h3>Customization</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Community Icon</label>
                    <div className="icon-selector">
                      {iconOptions.map(option => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            className={`icon-option ${formData.icon === option.value ? 'selected' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, icon: option.value }))}
                          >
                            <Icon size={20} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Welcome Message</label>
                  <textarea
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    placeholder="Welcome new members with a custom message"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-input-container">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tags to help people find your community"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button type="button" className="add-tag-btn" onClick={addTag}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="tags-list">
                      {formData.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                          <button type="button" className="remove-tag" onClick={() => removeTag(tag)}>
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="form-section">
                <h3>Features</h3>
                <div className="features-grid">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.discussions}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, discussions: e.target.checked }
                        }))}
                      />
                      <span className="checkmark"></span>
                      <div className="feature-info">
                        <span className="feature-name">Discussions</span>
                        <span className="feature-desc">Enable community discussions</span>
                      </div>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.knowledgeBase}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, knowledgeBase: e.target.checked }
                        }))}
                      />
                      <span className="checkmark"></span>
                      <div className="feature-info">
                        <span className="feature-name">Knowledge Base</span>
                        <span className="feature-desc">Share knowledge and resources</span>
                      </div>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.announcements}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, announcements: e.target.checked }
                        }))}
                      />
                      <span className="checkmark"></span>
                      <div className="feature-info">
                        <span className="feature-name">Announcements</span>
                        <span className="feature-desc">Post important updates</span>
                      </div>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.events}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, events: e.target.checked }
                        }))}
                      />
                      <span className="checkmark"></span>
                      <div className="feature-info">
                        <span className="feature-name">Events</span>
                        <span className="feature-desc">Schedule and manage events</span>
                      </div>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.features.fileSharing}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          features: { ...prev.features, fileSharing: e.target.checked }
                        }))}
                      />
                      <span className="checkmark"></span>
                      <div className="feature-info">
                        <span className="feature-name">File Sharing</span>
                        <span className="feature-desc">Share files and documents</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="form-section">
                <h3>Initial Members</h3>
                <div className="form-group">
                  <label>Add Members</label>
                  <div className="tags-input-container">
                    <input
                      type="text"
                      value={currentMember}
                      onChange={(e) => setCurrentMember(e.target.value)}
                      placeholder="Enter member name or email"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                    />
                    <button type="button" className="add-tag-btn" onClick={addMember}>
                      <UserPlus size={16} />
                    </button>
                  </div>
                  {formData.members.length > 0 && (
                    <div className="members-preview">
                      {formData.members.map(member => (
                        <div key={member} className="member-preview">
                          <div className="member-avatar">
                            {member.charAt(0).toUpperCase()}
                          </div>
                          <span className="member-name">{member}</span>
                          <button type="button" className="remove-member" onClick={() => removeMember(member)}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Community Rules */}
              <div className="form-section">
                <h3>Community Rules (Optional)</h3>
                <div className="form-group">
                  <div className="tags-input-container">
                    <input
                      type="text"
                      value={currentRule}
                      onChange={(e) => setCurrentRule(e.target.value)}
                      placeholder="Add a community rule or guideline"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                    />
                    <button type="button" className="add-tag-btn" onClick={addRule}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {formData.rules.length > 0 && (
                    <div className="rules-list">
                      {formData.rules.map((rule, index) => (
                        <div key={index} className="rule-item">
                          <span className="rule-number">{index + 1}.</span>
                          <span className="rule-text">{rule}</span>
                          <button type="button" className="remove-rule" onClick={() => removeRule(index)}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Plus size={16} />
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters = searchTerm || selectedCategory;

  if (loading) {
    return (
      <div className="community-loading">
        <div className="loading-spinner"></div>
        <p>Loading communities...</p>
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* Hero Section */}
      <div className="community-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <Users className="hero-icon" size={32} />
              Team Communities
            </h1>
            <p>Collaborate with your project teams, share knowledge, and build stronger connections</p>
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
            Create Community
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalCommunities}</div>
              <div className="stat-label">Communities</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalMembers}</div>
              <div className="stat-label">Total Members</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeCommunities}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.recentActivity}</div>
              <div className="stat-label">Recent Activity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="community-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search communities by name or description..."
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
            {hasActiveFilters && <span className="filter-badge">1</span>}
          </button>
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
                <option value="general">General</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="support">Support</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      <div className="community-layout">
        <div className="communities-sidebar">
          <div className="sidebar-header">
            <h3>Communities ({filteredCommunities.length})</h3>
          </div>
          
          <div className="communities-list">
            {filteredCommunities.map(community => (
              <div
                key={community.id}
                className={`community-item ${selectedCommunity === community.project ? 'active' : ''}`}
                onClick={() => setSelectedCommunity(community.project)}
              >
                <div className="community-icon">
                  <Users size={20} />
                </div>
                <div className="community-info">
                  <h4>{community.name}</h4>
                  <p>{community.description || 'No description'}</p>
                  <div className="community-meta">
                    <span className="member-count">
                      <Users size={12} />
                      {community.members.length} members
                    </span>
                    <span className={`status-badge ${community.isActive ? 'active' : 'inactive'}`}>
                      {community.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="community-content">
          {communityData ? (
            <>
              <div className="community-header">
                <div className="community-details">
                  <div className="community-title">
                    <div className="community-avatar">
                      <Users size={24} />
                    </div>
                    <div>
                  <h2>{communityData.community.name}</h2>
                  <p>{communityData.community.description}</p>
                    </div>
                  </div>
                  <div className="community-meta">
                    <span className="meta-item">
                      <Calendar size={14} />
                      Created {new Date(communityData.community.createdAt).toLocaleDateString()}
                    </span>
                    <span className="meta-item">
                      <Users size={14} />
                      {communityData.community.members.length} members
                    </span>
                  </div>
                </div>
                <div className="community-actions">
                  <button 
                    className="btn-outline"
                    onClick={() => setShowJoinModal(true)}
                  >
                    <UserPlus size={16} />
                    Add Member
                  </button>
                  <button className="btn-outline">
                    <Settings size={16} />
                    Settings
                  </button>
                </div>
              </div>

              <div className="community-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <BookOpen size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{communityData.knowledge.length}</h3>
                    <p>Knowledge Items</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <MessageSquare size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{communityData.queries.length}</h3>
                    <p>Q&A Discussions</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Activity size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{communityData.queries.filter(q => q.status === 'answered').length}</h3>
                    <p>Resolved Questions</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Star size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{communityData.knowledge.reduce((acc, k) => acc + k.likes, 0)}</h3>
                    <p>Total Likes</p>
                  </div>
                </div>
              </div>

              <div className="community-sections">
                <div className="section">
                  <div className="section-header">
                    <h3>
                      <Users size={20} />
                      Members ({communityData.community.members.length})
                    </h3>
                  </div>
                  <div className="members-grid">
                    {communityData.community.members.map((member, index) => (
                      <div key={index} className="member-card">
                        <div className="member-avatar">
                          {member.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-info">
                          <h4>{member}</h4>
                          <p>Team Member</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                    <h3>
                      <BookOpen size={20} />
                      Recent Knowledge
                    </h3>
                    <a href={`/knowledge?project=${selectedCommunity}`} className="view-all-link">
                      View All
                    </a>
                  </div>
                  <div className="knowledge-list">
                    {communityData.knowledge.length > 0 ? (
                      communityData.knowledge.slice(0, 5).map(item => (
                        <div key={item.id} className="knowledge-item">
                          <div className="knowledge-type">
                            <span className={`type-badge ${item.type}`}>
                              {item.type === 'sop' ? 'SOP' : 
                               item.type === 'best-practice' ? 'Best Practice' : 
                               item.type === 'experience' ? 'Experience' : 'Knowledge'}
                            </span>
                          </div>
                          <div className="knowledge-content">
                            <h4>{item.title}</h4>
                            <p>{item.content.substring(0, 100)}...</p>
                            <div className="knowledge-meta">
                              <span>by {item.author}</span>
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                              <span>{item.likes} likes</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <BookOpen size={48} />
                        <h3>No knowledge shared yet</h3>
                        <p>Be the first to share knowledge in this community</p>
                        <button className="btn-primary">
                          <Plus size={16} />
                          Share Knowledge
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="section">
                  <div className="section-header">
                    <h3>
                      <MessageSquare size={20} />
                      Recent Q&A
                    </h3>
                    <a href={`/queries?project=${selectedCommunity}`} className="view-all-link">
                      View All
                    </a>
                  </div>
                  <div className="queries-list">
                    {communityData.queries.length > 0 ? (
                      communityData.queries.slice(0, 5).map(query => (
                        <div key={query.id} className="query-item">
                          <div className="query-status">
                            {query.status === 'answered' ? (
                              <span className="status-badge answered">Answered</span>
                            ) : (
                              <span className="status-badge pending">Pending</span>
                            )}
                          </div>
                          <div className="query-content">
                            <h4>{query.question}</h4>
                            <div className="query-meta">
                              <span>by {query.author}</span>
                              <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <MessageSquare size={48} />
                        <h3>No questions asked yet</h3>
                        <p>Start a discussion by asking a question</p>
                        <button className="btn-primary">
                          <Plus size={16} />
                          Ask Question
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-community-selected">
              <div className="empty-icon">
                <Users size={64} />
              </div>
              <h2>Select a Community</h2>
              <p>Choose a community from the sidebar to view its details and activity</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && <CreateCommunityModal />}

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Member</h2>
              <button className="close-btn" onClick={() => setShowJoinModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Member Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter member name"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinCommunity()}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowJoinModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleJoinCommunity}
                disabled={!newMemberName.trim()}
              >
                <UserPlus size={16} />
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community; 