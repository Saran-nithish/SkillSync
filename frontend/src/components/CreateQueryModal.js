import React, { useState } from 'react';
import { 
  X, MessageSquare, Bot, User, FolderOpen, HelpCircle, 
  Zap, AlertCircle, CheckCircle, Send, Brain, Sparkles
} from 'lucide-react';
import './CreateQueryModal.css';

const CreateQueryModal = ({ onClose, onSubmit, projects = [] }) => {
  const [formData, setFormData] = useState({
    question: '',
    author: '',
    project: '',
    requestAIAnswer: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  const questionTypes = [
    { 
      id: 'technical', 
      label: 'Technical Question', 
      icon: Zap, 
      color: '#3b82f6',
      desc: 'Ask about technical processes, tools, or implementation',
      examples: ['How do I implement feature X?', 'What\'s the best approach for Y?']
    },
    { 
      id: 'process', 
      label: 'Process & Workflow', 
      icon: HelpCircle, 
      color: '#10b981',
      desc: 'Questions about procedures, workflows, or business processes',
      examples: ['What\'s the approval process for Z?', 'How do we handle situation A?']
    },
    { 
      id: 'general', 
      label: 'General Help', 
      icon: MessageSquare, 
      color: '#f59e0b',
      desc: 'General questions or requests for assistance',
      examples: ['Can someone help with...?', 'I need guidance on...']
    }
  ];

  const [selectedType, setSelectedType] = useState('general');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Your name is required';
    }
    
    if (!formData.project) {
      newErrors.project = 'Project selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        questionType: selectedType
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getSelectedTypeConfig = () => {
    return questionTypes.find(type => type.id === selectedType) || questionTypes[2];
  };

  const canProceedToStep2 = formData.question.trim() && formData.question.length >= 10;
  const selectedTypeConfig = getSelectedTypeConfig();
  const TypeIcon = selectedTypeConfig.icon;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large query-modal" onClick={(e) => e.stopPropagation()}>
        {/* Enhanced Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="query-icon" style={{ background: selectedTypeConfig.color }}>
              <TypeIcon size={24} />
            </div>
            <div className="title-content">
              <h2>Ask a Question</h2>
              <p>Get help from your team or AI assistant</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${activeStep >= 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Question</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${activeStep >= 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="query-form">
          <div className="form-content">
            {/* Step 1: Question */}
            {activeStep === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <HelpCircle size={24} />
                  <div>
                    <h3>What would you like to ask?</h3>
                    <p>Be specific and clear to get the best answers</p>
                  </div>
                </div>

                {/* Question Type Selection */}
                <div className="form-section">
                  <label className="section-label">Question Type</label>
                  <div className="type-selector">
                    {questionTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <label 
                          key={type.id} 
                          className={`type-option ${selectedType === type.id ? 'selected' : ''}`}
                          style={{ '--type-color': type.color }}
                        >
                          <input
                            type="radio"
                            name="questionType"
                            value={type.id}
                            checked={selectedType === type.id}
                            onChange={(e) => setSelectedType(e.target.value)}
                          />
                          <div className="type-content">
                            <div className="type-icon">
                              <Icon size={20} />
                            </div>
                            <div className="type-info">
                              <div className="type-name">{type.label}</div>
                              <div className="type-desc">{type.desc}</div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Question Examples */}
                <div className="examples-section">
                  <h4>Example questions for {selectedTypeConfig.label}:</h4>
                  <div className="examples-list">
                    {selectedTypeConfig.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="example-item"
                        onClick={() => setFormData(prev => ({ ...prev, question: example }))}
                      >
                        <MessageSquare size={16} />
                        <span>"{example}"</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Input */}
                <div className="form-group">
                  <label htmlFor="question" className="form-label">
                    <MessageSquare size={18} />
                    Your Question *
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="What would you like to know? Be specific for better answers..."
                    rows={6}
                    className={errors.question ? 'error' : ''}
                    maxLength={1000}
                  />
                  {errors.question && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.question}
                    </div>
                  )}
                  <div className="char-count">{formData.question.length}/1000</div>
                </div>

                {/* Question Tips */}
                <div className="tips-section">
                  <h4>💡 Tips for better answers:</h4>
                  <ul className="tips-list">
                    <li>Be specific about what you're trying to achieve</li>
                    <li>Include relevant context or background information</li>
                    <li>Mention what you've already tried (if applicable)</li>
                    <li>Ask one clear question at a time</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {activeStep === 2 && (
              <div className="step-content">
                <div className="step-header">
                  <User size={24} />
                  <div>
                    <h3>Add your details</h3>
                    <p>Help us route your question to the right people</p>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="author" className="form-label">
                      <User size={18} />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={errors.author ? 'error' : ''}
                    />
                    {errors.author && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        {errors.author}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="project" className="form-label">
                      <FolderOpen size={18} />
                      Project *
                    </label>
                    <select
                      id="project"
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      className={errors.project ? 'error' : ''}
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </select>
                    {errors.project && (
                      <div className="error-message">
                        <AlertCircle size={16} />
                        {errors.project}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Answer Option */}
                <div className="form-group">
                  <div className="ai-option">
                    <div className="checkbox-group enhanced">
                      <input
                        type="checkbox"
                        id="requestAIAnswer"
                        name="requestAIAnswer"
                        checked={formData.requestAIAnswer}
                        onChange={handleChange}
                      />
                      <label htmlFor="requestAIAnswer" className="checkbox-label">
                        <span className="checkmark"></span>
                        <div className="ai-content">
                          <div className="ai-header">
                            <Brain size={20} />
                            <span className="ai-title">Request AI Answer</span>
                            <span className="ai-badge">
                              <Sparkles size={12} />
                              Smart
                            </span>
                          </div>
                          <p className="ai-desc">
                            Get an instant AI-powered answer along with community responses
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* AI Benefits */}
                {formData.requestAIAnswer && (
                  <div className="ai-benefits">
                    <h4>🤖 AI Assistant Benefits:</h4>
                    <div className="benefits-grid">
                      <div className="benefit-item">
                        <Zap size={16} />
                        <span>Instant responses</span>
                      </div>
                      <div className="benefit-item">
                        <Brain size={16} />
                        <span>Knowledge base search</span>
                      </div>
                      <div className="benefit-item">
                        <CheckCircle size={16} />
                        <span>24/7 availability</span>
                      </div>
                      <div className="benefit-item">
                        <Sparkles size={16} />
                        <span>Contextual answers</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {activeStep === 3 && (
              <div className="step-content">
                <div className="step-header">
                  <CheckCircle size={24} />
                  <div>
                    <h3>Review your question</h3>
                    <p>Make sure everything looks good before submitting</p>
                  </div>
                </div>

                <div className="review-content">
                  <div className="review-section">
                    <h4>Question Type</h4>
                    <div className="review-type">
                      <TypeIcon size={20} />
                      <span>{selectedTypeConfig.label}</span>
                    </div>
                  </div>

                  <div className="review-section">
                    <h4>Your Question</h4>
                    <div className="question-preview">
                      {formData.question}
                    </div>
                  </div>

                  <div className="review-row">
                    <div className="review-section">
                      <h4>Author</h4>
                      <p>{formData.author}</p>
                    </div>

                    <div className="review-section">
                      <h4>Project</h4>
                      <p>{formData.project}</p>
                    </div>
                  </div>

                  {formData.requestAIAnswer && (
                    <div className="review-section">
                      <h4>AI Assistant</h4>
                      <div className="ai-enabled">
                        <Brain size={20} />
                        <span>AI answer requested</span>
                        <span className="ai-badge">
                          <Sparkles size={12} />
                          Smart
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="submission-note">
                    <div className="note-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div className="note-content">
                      <h4>What happens next?</h4>
                      <p>Your question will be posted to the Q&A section where team members can provide answers. {formData.requestAIAnswer ? 'You\'ll also receive an instant AI-powered response.' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="modal-actions">
            <div className="action-left">
              {activeStep > 1 && (
                <button 
                  type="button" 
                  className="btn-outline"
                  onClick={() => setActiveStep(prev => prev - 1)}
                >
                  Back
                </button>
              )}
            </div>

            <div className="action-right">
              {activeStep < 3 ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveStep(prev => prev + 1)}
                  disabled={activeStep === 1 && !canProceedToStep2}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Ask Question
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQueryModal; 