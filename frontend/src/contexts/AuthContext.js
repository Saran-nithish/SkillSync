import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken === 'admin-token-123') {
        // For our simple frontend auth, if token exists and is valid, restore user
        const user = {
          id: '1',
          username: 'admin',
          email: 'admin@skillsync.com',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        };
        
        setUser(user);
        setToken(storedToken);
      } else {
        // Invalid or missing token
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    // Simple frontend login - if username is admin and password is admin, login succeeds
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const user = {
        id: '1',
        username: 'admin',
        email: 'admin@skillsync.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      };
      
      const token = 'admin-token-123';
      
      setUser(user);
      setToken(token);
      localStorage.setItem('authToken', token);
      
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials. Use admin/admin to login.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      setUser(user);
      setToken(token);
      localStorage.setItem('authToken', token);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    }
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 