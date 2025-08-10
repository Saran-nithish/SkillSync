import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  FileText, 
  HelpCircle, 
  Users, 
  Video, 
  BookOpen,
  Upload,
  X
} from 'lucide-react';
import CreateKnowledgeModal from './CreateKnowledgeModal';
import CreateQueryModal from './CreateQueryModal';
import UploadSOPModal from './UploadSOPModal';
import './CreateNewDropdown.css';

const CreateNewDropdown = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const createOptions = [
    {
      id: 'knowledge',
      icon: FileText,
      title: 'Share Knowledge',
      description: 'Share your expertise and best practices',
      color: '#3b82f6'
    },
    {
      id: 'query',
      icon: HelpCircle,
      title: 'Ask Question',
      description: 'Get help from your colleagues',
      color: '#10b981'
    },
    {
      id: 'create-sop',
      icon: BookOpen,
      title: 'Create SOP',
      description: 'Document processes and workflows',
      color: '#f59e0b'
    },
    {
      id: 'upload-sop',
      icon: Upload,
      title: 'Upload SOP',
      description: 'Upload standard operating procedures',
      color: '#f59e0b'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Join Community',
      description: 'Connect with teams and experts',
      color: '#8b5cf6'
    },
    {
      id: 'video',
      icon: Video,
      title: 'Upload KT Video',
      description: 'Record and share video tutorials',
      color: '#ef4444'
    }
  ];

  const handleOptionClick = (optionId) => {
    setActiveModal(optionId);
    setIsModalOpen(false);
  };

  const closeActiveModal = () => {
    setActiveModal(null);
  };

  const handleButtonClick = () => {
    console.log('Create New button clicked'); // Debug log
    setIsModalOpen(true);
  };

  const handleSOPSubmit = async (sopData) => {
    try {
      // The UploadSOPModal will handle submission to knowledge API
      console.log('SOP uploaded successfully:', sopData);
      closeActiveModal();
    } catch (error) {
      console.error('Error uploading SOP:', error);
    }
  };

  const handleKnowledgeSubmit = async (knowledgeData) => {
    try {
      console.log('Knowledge shared successfully:', knowledgeData);
      closeActiveModal();
    } catch (error) {
      console.error('Error sharing knowledge:', error);
    }
  };

  const handleQuerySubmit = async (queryData) => {
    try {
      console.log('Question submitted successfully:', queryData);
      closeActiveModal();
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  // Modal content to be rendered via portal
  const modalContent = (
    <>
      {/* Create New Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New</h2>
              <button 
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p>What would you like to create today?</p>
              <div className="create-options-grid">
                {createOptions.map((option) => (
                  <button
                    key={option.id}
                    className="create-option"
                    onClick={() => handleOptionClick(option.id)}
                    style={{ '--option-color': option.color }}
                  >
                    <div className="option-icon">
                      <option.icon size={24} />
                    </div>
                    <div className="option-content">
                      <h4>{option.title}</h4>
                      <p>{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specific Modals */}
      {activeModal === 'knowledge' && (
        <CreateKnowledgeModal
          onClose={closeActiveModal}
          onSubmit={handleKnowledgeSubmit}
          projects={['Project Alpha', 'Project Beta', 'Project Gamma']} // Mock projects
          categories={['Technical', 'Process', 'Best Practice', 'Training']} // Mock categories
        />
      )}

      {activeModal === 'query' && (
        <CreateQueryModal
          onClose={closeActiveModal}
          onSubmit={handleQuerySubmit}
          projects={['Project Alpha', 'Project Beta', 'Project Gamma']} // Mock projects
        />
      )}

      {activeModal === 'upload-sop' && (
        <UploadSOPModal
          onClose={closeActiveModal}
          onSubmit={handleSOPSubmit}
          projects={['Project Alpha', 'Project Beta', 'Project Gamma']} // Mock projects
        />
      )}

      {/* Placeholder for other modals */}
      {activeModal === 'create-sop' && (
        <div className="modal-overlay" onClick={closeActiveModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create SOP</h2>
              <button className="close-btn" onClick={closeActiveModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>SOP creation feature coming soon!</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'community' && (
        <div className="modal-overlay" onClick={closeActiveModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join Community</h2>
              <button className="close-btn" onClick={closeActiveModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Community joining feature coming soon!</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'video' && (
        <div className="modal-overlay" onClick={closeActiveModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload KT Video</h2>
              <button className="close-btn" onClick={closeActiveModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Video upload feature coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="create-new-dropdown">
        <button
          className="create-new-button"
          onClick={handleButtonClick}
        >
          <Plus size={18} />
          Create New
        </button>
      </div>

      {/* Render modals via portal to document.body */}
      {(isModalOpen || activeModal) && createPortal(modalContent, document.body)}
    </>
  );
};

export default CreateNewDropdown; 