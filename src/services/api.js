import axios from 'axios';

// Use relative URL for Vercel deployment, fallback to localhost for development
const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds timeout
});

// Ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Une erreur est survenue';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response
      return Promise.reject(new Error('Pas de réponse du serveur. Vérifiez votre connexion.'));
    } else {
      // Error in request setup
      return Promise.reject(new Error('Erreur de configuration de la requête'));
    }
  }
);

export default api;