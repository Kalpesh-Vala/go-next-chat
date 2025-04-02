// API utilities for making requests to the backend

const API_BASE_URL = 'http://localhost:8080/api';

// Helper to get the token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Generic fetch function with authorization
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle unauthorized errors
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Authentication required');
  }
  
  return response;
};

// API functions
export const api = {
  // User endpoints
  users: {
    getAll: async () => {
      const response = await fetchWithAuth('/users');
      return response.json();
    },
    
    getById: async (id) => {
      const response = await fetchWithAuth(`/users/${id}`);
      return response.json();
    },
    
    register: async (userData) => {
      const response = await fetchWithAuth('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.json();
    },
  },
  
  // Authentication endpoints
  auth: {
    login: async (credentials) => {
      const response = await fetchWithAuth('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
  },
};

export default api;