import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import './AnswerQueryModal.css';

const AnswerQueryModal = ({ query, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    answer: '',
    answeredBy: 'John Doe' // In a real app, this would come from auth context
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
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
      setErrors({ submit: 'Failed to submit answer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <MessageSquare size={24} className="title-icon" />
            <h2>Answer Question</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="answer-form">
          <div className="question-preview">
            <h3>Question:</h3>
            <p>{query.question}</p>
            <div className="question-meta">
              <span>Asked by {query.author}</span>
              <span>Project: {query.project}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="answer">Your Answer *</label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                className={`form-control ${errors.answer ? 'error' : ''}`}
                placeholder="Provide a detailed answer to help your teammate. Include steps, examples, or relevant resources..."
                rows={8}
              />
              {errors.answer && <span className="error-message">{errors.answer}</span>}
              <div className="form-hint">
                Provide a clear, helpful answer with specific details and examples when possible.
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
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnswerQueryModal; 