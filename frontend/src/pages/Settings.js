import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Bell, Palette, Globe, Shield, 
  Save, Eye, EyeOff, Camera, Mail, Phone,
  MapPin, Calendar, Briefcase, Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import './Settings.css';

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const { 
    theme, 
    fontSize, 
    compactMode, 
    language, 
    updateTheme, 
    updateFontSize, 
    updateCompactMode, 
    updateLanguage 
  } = useTheme();
  const { 
    settings: savedNotificationSettings, 
    updateSettings: updateNotificationSettings 
  } = useNotifications();
  
  // Profile Settings State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    location: '',
    jobTitle: '',
    bio: '',
    birthDate: '',
    profilePicture: null
  });

  // Security Settings State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState(savedNotificationSettings);

  // Appearance Settings State (using theme context)
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme,
    language,
    fontSize,
    compactMode
  });

  // Auto-save appearance settings when they change
  useEffect(() => {
    setAppearanceSettings({
      theme,
      language,
      fontSize,
      compactMode
    });
  }, [theme, language, fontSize, compactMode]);

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    showOnlineStatus: true
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (securityData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Password updated successfully!');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleSettingsSave = async (settingsType) => {
    setIsLoading(true);
    
    try {
      if (settingsType === 'Notification') {
        updateNotificationSettings(notificationSettings);
      } else if (settingsType === 'Appearance') {
        updateTheme(appearanceSettings.theme);
        updateFontSize(appearanceSettings.fontSize);
        updateCompactMode(appearanceSettings.compactMode);
        updateLanguage(appearanceSettings.language);
      }
      
      setTimeout(() => {
        setSuccessMessage(`${settingsType} settings updated successfully!`);
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }, 500);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Profile Information</h2>
        <p>Update your personal information and profile details</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="settings-form">
        {/* Profile Picture */}
        <div className="profile-picture-section">
          <div className="profile-picture-container">
            <div className="profile-picture">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" />
              ) : (
                <User size={48} />
              )}
            </div>
            <label className="profile-picture-upload">
              <Camera size={16} />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                hidden
              />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
                placeholder="Choose a username"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                placeholder="Enter your location"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={profileData.jobTitle}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  jobTitle: e.target.value
                }))}
                placeholder="Enter your job title"
              />
            </div>
            <div className="form-group">
              <label>Birth Date</label>
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  birthDate: e.target.value
                }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                bio: e.target.value
              }))}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner small"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Security Settings</h2>
        <p>Manage your password and security preferences</p>
      </div>

      <form onSubmit={handleSecuritySubmit} className="settings-form">
        <div className="form-section">
          <h3>Change Password</h3>
          
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-input">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  current: !prev.current
                }))}
              >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="password-input">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={securityData.newPassword}
                onChange={(e) => setSecurityData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  new: !prev.new
                }))}
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="password-input">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  confirm: !prev.confirm
                }))}
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner small"></div>
                Updating...
              </>
            ) : (
              <>
                <Lock size={16} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Notification Preferences</h2>
        <p>Choose what notifications you want to receive</p>
      </div>

      <div className="settings-form">
        <div className="form-section">
          <h3>General Notifications</h3>
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <label>Email Notifications</label>
                <span>Receive notifications via email</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    emailNotifications: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Push Notifications</label>
                <span>Receive browser push notifications</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    pushNotifications: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Weekly Digest</label>
                <span>Get a weekly summary of activities</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyDigest}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    weeklyDigest: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Content Notifications</h3>
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <label>Community Updates</label>
                <span>New posts and activities in your communities</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.communityUpdates}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    communityUpdates: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Knowledge Updates</label>
                <span>New knowledge articles and updates</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.knowledgeUpdates}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    knowledgeUpdates: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Query Answers</label>
                <span>When someone answers your questions</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.queryAnswers}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    queryAnswers: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Mentions</label>
                <span>When someone mentions you in comments</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.mentions}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    mentions: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSettingsSave('Notification')}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner small"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Appearance Settings</h2>
        <p>Customize how SkillSync looks and feels</p>
      </div>

      <div className="settings-form">
        <div className="form-section">
          <h3>Theme</h3>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={appearanceSettings.theme === 'light'}
                onChange={(e) => {
                  updateTheme(e.target.value);
                  setAppearanceSettings(prev => ({
                    ...prev,
                    theme: e.target.value
                  }));
                }}
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Light Theme</strong>
                <span>Clean and bright interface</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={appearanceSettings.theme === 'dark'}
                onChange={(e) => {
                  updateTheme(e.target.value);
                  setAppearanceSettings(prev => ({
                    ...prev,
                    theme: e.target.value
                  }));
                }}
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Dark Theme</strong>
                <span>Easy on the eyes in low light</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="theme"
                value="auto"
                checked={appearanceSettings.theme === 'auto'}
                onChange={(e) => {
                  updateTheme(e.target.value);
                  setAppearanceSettings(prev => ({
                    ...prev,
                    theme: e.target.value
                  }));
                }}
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Auto</strong>
                <span>Follow system preference</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Language & Region</h3>
          <div className="form-group">
            <label>Language</label>
            <select
              value={appearanceSettings.language}
              onChange={(e) => {
                updateLanguage(e.target.value);
                setAppearanceSettings(prev => ({
                  ...prev,
                  language: e.target.value
                }));
              }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Display Options</h3>
          <div className="form-group">
            <label>Font Size</label>
            <select
              value={appearanceSettings.fontSize}
              onChange={(e) => {
                updateFontSize(e.target.value);
                setAppearanceSettings(prev => ({
                  ...prev,
                  fontSize: e.target.value
                }));
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <label>Compact Mode</label>
              <span>Show more content in less space</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={appearanceSettings.compactMode}
                onChange={(e) => {
                  updateCompactMode(e.target.checked);
                  setAppearanceSettings(prev => ({
                    ...prev,
                    compactMode: e.target.checked
                  }));
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <div className="auto-save-notice">
            <span>✓ Settings are saved automatically</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Privacy Settings</h2>
        <p>Control your privacy and what others can see</p>
      </div>

      <div className="settings-form">
        <div className="form-section">
          <h3>Profile Visibility</h3>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={privacySettings.profileVisibility === 'public'}
                onChange={(e) => setPrivacySettings(prev => ({
                  ...prev,
                  profileVisibility: e.target.value
                }))}
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Public</strong>
                <span>Anyone can view your profile</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="profileVisibility"
                value="members"
                checked={privacySettings.profileVisibility === 'members'}
                onChange={(e) => setPrivacySettings(prev => ({
                  ...prev,
                  profileVisibility: e.target.value
                }))}
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Members Only</strong>
                <span>Only registered users can view</span>
              </div>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={privacySettings.profileVisibility === 'private'}
                onChange={(e) => setPrivacySettings(prev => ({
                  ...prev,
                  profileVisibility: e.target.value
                }))}
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Private</strong>
                <span>Only you can view your profile</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <label>Show Email Address</label>
                <span>Allow others to see your email</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.showEmail}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    showEmail: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Show Phone Number</label>
                <span>Allow others to see your phone</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.showPhone}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    showPhone: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Show Location</label>
                <span>Display your location on profile</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.showLocation}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    showLocation: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Communication</h3>
          <div className="toggle-group">
            <div className="toggle-item">
              <div className="toggle-info">
                <label>Allow Direct Messages</label>
                <span>Let others send you private messages</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.allowMessages}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    allowMessages: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <label>Show Online Status</label>
                <span>Display when you're online</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.showOnlineStatus}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    showOnlineStatus: e.target.checked
                  }))}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSettingsSave('Privacy')}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner small"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Privacy Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-sidebar">
          <h1>Settings</h1>
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'privacy' && renderPrivacyTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 