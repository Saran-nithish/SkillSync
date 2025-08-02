import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import './CreateQueryModal.css';

const CreateQueryModal = ({ onClose, onSubmit, projects }) => {
  const [formData, setFormData] = useState({
    question: '',
    project: '',
    author: 'John Doe' // In a real app, this would come from auth context
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (!formData.project.trim()) {
      newErrors.project = 'Project is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <HelpCircle size={24} className="title-icon" />
            <h2>Ask a Question</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="query-form">
          <div className="form-group">
            <label htmlFor="project">Project *</label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              className={`form-control ${errors.project ? 'error' : ''}`}
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            {errors.project && <span className="error-message">{errors.project}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="question">Your Question *</label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              className={`form-control ${errors.question ? 'error' : ''}`}
              placeholder="Describe your question in detail. Include context, what you've tried, and what specific help you need..."
              rows={6}
            />
            {errors.question && <span className="error-message">{errors.question}</span>}
            <div className="form-hint">
              Be specific and provide context to get better answers from your teammates.
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Ask Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQueryModal; 