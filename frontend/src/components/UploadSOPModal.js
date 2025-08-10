import React, { useState } from 'react';
import { 
  X, Upload, FileText, AlertCircle, CheckCircle, User, 
  FolderOpen, Hash, Tag, BookOpen, Zap, File, Trash2
} from 'lucide-react';
import { fileAPI, knowledgeAPI } from '../services/api';
import './UploadSOPModal.css';

const UploadSOPModal = ({ onClose, onSubmit, projects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    project: '',
    category: '',
    tags: [],
    type: 'sop'
  });
  const [tagInput, setTagInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  const validateForm = () => {
    const newErrors = {};
    
    if (!uploadedFile) {
      newErrors.file = 'SOP document is required';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
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
      // Create knowledge entry with SOP type and file attachment
      const submitData = {
        ...formData,
        content: formData.description, // Use description as content
        attachments: uploadedFile ? [{
          id: uploadedFile.id,
          filename: uploadedFile.filename,
          originalName: uploadedFile.originalName,
          mimetype: uploadedFile.mimetype,
          size: uploadedFile.size
        }] : []
      };
      
      if (onSubmit) {
        await onSubmit(submitData);
      } else {
        // Default submission to knowledge API
        await knowledgeAPI.create(submitData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error uploading SOP:', error);
      setErrors({ submit: 'Failed to upload SOP. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const maxSize = 50 * 1024 * 1024; // 50MB for SOP documents
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (file.size > maxSize) {
      setErrors({ file: 'File size must be less than 50MB' });
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setErrors({ file: 'Only PDF, Word documents, and text files are supported' });
      return;
    }

    setUploading(true);
    setErrors({ file: '' });
    
    try {
      const response = await fileAPI.upload(file);
      setUploadedFile(response.data);
      
      // Auto-fill title if empty
      if (!formData.title.trim()) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setFormData(prev => ({
          ...prev,
          title: fileName
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrors({ file: 'Failed to upload file. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setErrors({ file: '' });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canProceedToStep2 = uploadedFile && formData.title.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large sop-modal" onClick={(e) => e.stopPropagation()}>
        {/* Enhanced Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="sop-icon">
              <BookOpen size={24} />
            </div>
            <div className="title-content">
              <h2>Upload SOP</h2>
              <p>Share standard operating procedures with your team</p>
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
            <div className="step-label">Upload</div>
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

        <form onSubmit={handleSubmit} className="sop-form">
          <div className="form-content">
            {/* Step 1: Upload */}
            {activeStep === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <Upload size={24} />
                  <div>
                    <h3>Upload your SOP document</h3>
                    <p>Select a PDF, Word document, or text file containing your standard operating procedure</p>
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="upload-section">
                  {!uploadedFile ? (
                    <div className="upload-area">
                      <input
                        type="file"
                        id="sop-upload"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt"
                        className="file-input"
                        disabled={uploading}
                      />
                      <label htmlFor="sop-upload" className={`upload-label ${uploading ? 'uploading' : ''}`}>
                        <Upload size={48} />
                        <div className="upload-text">
                          <div className="upload-title">
                            {uploading ? 'Uploading document...' : 'Click to upload SOP document'}
                          </div>
                          <div className="upload-subtitle">
                            PDF, Word documents, or text files (Max 50MB)
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="uploaded-file">
                      <div className="file-preview">
                        <div className="file-icon">
                          <FileText size={32} />
                        </div>
                        <div className="file-info">
                          <div className="file-name">{uploadedFile.originalName}</div>
                          <div className="file-size">{formatFileSize(uploadedFile.size)}</div>
                          <div className="file-status">
                            <CheckCircle size={16} />
                            <span>Successfully uploaded</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={removeFile}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.file && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.file}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    <FileText size={18} />
                    SOP Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a clear, descriptive title for this SOP..."
                    className={errors.title ? 'error' : ''}
                    maxLength={100}
                  />
                  {errors.title && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.title}
                    </div>
                  )}
                  <div className="char-count">{formData.title.length}/100</div>
                </div>

                {/* SOP Tips */}
                <div className="tips-section">
                  <h4>📋 SOP Best Practices:</h4>
                  <ul className="tips-list">
                    <li>Use clear, step-by-step instructions</li>
                    <li>Include screenshots or diagrams when helpful</li>
                    <li>Keep language simple and professional</li>
                    <li>Review and update procedures regularly</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {activeStep === 2 && (
              <div className="step-content">
                <div className="step-header">
                  <Tag size={24} />
                  <div>
                    <h3>Add details and context</h3>
                    <p>Help others discover and understand your SOP</p>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    <BookOpen size={18} />
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this SOP covers, when to use it, and who should follow it..."
                    rows={6}
                    className={errors.description ? 'error' : ''}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      {errors.description}
                    </div>
                  )}
                  <div className="char-count">{formData.description.length}/1000</div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="author" className="form-label">
                      <User size={18} />
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Your name"
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

                {/* Category */}
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    <Hash size={18} />
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category (optional)</option>
                    <option value="process">Process & Workflow</option>
                    <option value="safety">Safety & Compliance</option>
                    <option value="technical">Technical Procedures</option>
                    <option value="administrative">Administrative</option>
                    <option value="quality">Quality Assurance</option>
                    <option value="training">Training & Onboarding</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label className="form-label">
                    <Tag size={18} />
                    Tags ({formData.tags.length}/10)
                  </label>
                  <div className="tags-input-container">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add tags to help others find this SOP..."
                      disabled={formData.tags.length >= 10}
                    />
                    <button 
                      type="button" 
                      className="add-tag-btn" 
                      onClick={addTag}
                      disabled={!tagInput.trim() || formData.tags.length >= 10}
                    >
                      <Tag size={16} />
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
            )}

            {/* Step 3: Review */}
            {activeStep === 3 && (
              <div className="step-content">
                <div className="step-header">
                  <CheckCircle size={24} />
                  <div>
                    <h3>Review your SOP</h3>
                    <p>Make sure everything looks good before publishing</p>
                  </div>
                </div>

                <div className="review-content">
                  <div className="review-section">
                    <h4>Document</h4>
                    <div className="file-review">
                      <FileText size={20} />
                      <span>{uploadedFile?.originalName}</span>
                      <span className="file-size">({formatFileSize(uploadedFile?.size || 0)})</span>
                    </div>
                  </div>

                  <div className="review-section">
                    <h4>Title</h4>
                    <p>{formData.title}</p>
                  </div>

                  <div className="review-section">
                    <h4>Description</h4>
                    <div className="description-preview">
                      {formData.description.length > 200 
                        ? `${formData.description.substring(0, 200)}...` 
                        : formData.description
                      }
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

                  {formData.category && (
                    <div className="review-section">
                      <h4>Category</h4>
                      <p>{formData.category}</p>
                    </div>
                  )}

                  {formData.tags.length > 0 && (
                    <div className="review-section">
                      <h4>Tags</h4>
                      <div className="tags-list">
                        {formData.tags.map(tag => (
                          <span key={tag} className="tag-readonly">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="submission-note">
                    <div className="note-icon">
                      <BookOpen size={20} />
                    </div>
                    <div className="note-content">
                      <h4>What happens next?</h4>
                      <p>Your SOP will be published to the Knowledge Base where team members can access, download, and reference it for their work processes.</p>
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
                      Publishing...
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      Publish SOP
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

export default UploadSOPModal; 