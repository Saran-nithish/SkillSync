import React, { useState } from 'react';
import { 
  X, 
  LogIn,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    jobTitle: '',
    birthDate: ''
  });

  const handleClose = () => {
    setError('');
    setLoginData({ username: '', password: '' });
    setSignupData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      location: '',
      jobTitle: '',
      birthDate: ''
    });
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(loginData);
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(signupData);
      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderLogin = () => (
    <form onSubmit={handleLoginSubmit} className="auth-form">
      <div className="form-group">
        <label>Username or Email</label>
        <input
          type="text"
          value={loginData.username}
          onChange={(e) => setLoginData(prev => ({
            ...prev,
            username: e.target.value
          }))}
          placeholder="Enter your username or email"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={loginData.password}
          onChange={(e) => setLoginData(prev => ({
            ...prev,
            password: e.target.value
          }))}
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            Signing In...
          </>
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>

      <div className="auth-demo-notice">
        <Sparkles size={16} />
        <span>Demo: Use <strong>admin</strong> / <strong>admin</strong> to login</span>
      </div>

      <div className="auth-switch">
        <span>Don't have an account?</span>
        <button 
          type="button" 
          className="switch-btn"
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
      </div>
    </form>
  );

  const renderSignup = () => (
    <form onSubmit={handleSignupSubmit} className="auth-form signup-form">
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={signupData.firstName}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              firstName: e.target.value
            }))}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={signupData.lastName}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              lastName: e.target.value
            }))}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={signupData.username}
          onChange={(e) => setSignupData(prev => ({
            ...prev,
            username: e.target.value
          }))}
          placeholder="Choose a unique username"
          required
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={signupData.email}
          onChange={(e) => setSignupData(prev => ({
            ...prev,
            email: e.target.value
          }))}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={signupData.phone}
            onChange={(e) => setSignupData(prev => ({
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
            value={signupData.location}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              location: e.target.value
            }))}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            value={signupData.jobTitle}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              jobTitle: e.target.value
            }))}
            placeholder="Your job title"
          />
        </div>
        <div className="form-group">
          <label>Birth Date</label>
          <input
            type="date"
            value={signupData.birthDate}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              birthDate: e.target.value
            }))}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={signupData.password}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              password: e.target.value
            }))}
            placeholder="Create a strong password"
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData(prev => ({
              ...prev,
              confirmPassword: e.target.value
            }))}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>

      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Create Account
          </>
        )}
      </button>

      <div className="auth-switch">
        <span>Already have an account?</span>
        <button 
          type="button" 
          className="switch-btn"
          onClick={() => setMode('login')}
        >
          Sign In
        </button>
      </div>
    </form>
  );

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={handleClose}>
          <X size={20} />
        </button>
        
        <div className="auth-modal-content">
          <div className="auth-header">
            <div className={`auth-icon ${mode}`}>
              {mode === 'login' ? <LogIn size={32} /> : <UserPlus size={32} />}
            </div>
            <h2>{mode === 'login' ? 'Welcome Back!' : 'Join SkillSync'}</h2>
            <p>
              {mode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Create your account to get started'
              }
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {mode === 'login' ? renderLogin() : renderSignup()}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 