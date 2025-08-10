import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods

// Knowledge API
export const knowledgeAPI = {
  getAll: (params = {}) => api.get('/knowledge', { params }),
  create: (data) => api.post('/knowledge', data),
  like: (id) => api.post(`/knowledge/${id}/like`),
  getCategories: () => api.get('/categories'),
  getProjects: () => api.get('/projects'),
};

// Query API
export const queryAPI = {
  getAll: (params = {}) => api.get('/queries', { params }),
  create: (data) => api.post('/queries', data),
  answer: (id, data) => api.post(`/queries/${id}/answer`, data),
  getAIAnswer: (id) => api.post(`/queries/${id}/ai-answer`),
};

// Community API
export const communityAPI = {
  getAll: () => api.get('/communities'),
  getByProject: (project) => api.get(`/communities/${project}`),
  create: (data) => api.post('/communities', data),
  join: (id, memberName) => api.post(`/communities/${id}/join`, { memberName }),
};

// Search API
export const searchAPI = {
  search: (query, type = 'all') => api.get('/search', { params: { q: query, type } }),
};

// File Upload API
export const fileAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: () => api.get('/analytics'),
};

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  verifyToken: () => api.get('/auth/verify'),
};

export default api; 