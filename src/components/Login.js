import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simplified login for demo - in production, implement proper authentication
      // For now, allow selecting a role directly
      const role = email.includes('admin') ? 'admin' : 
                   email.includes('teacher') || email.includes('enseignant') ? 'enseignant' : 
                   'etudiant';
      const token = 'demo-token-' + Date.now();
      onLogin(token, role);
      // Redirection selon le rôle
      if (role === 'etudiant') navigate('/student');
      else if (role === 'enseignant') navigate('/teacher');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Connexion</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Mot de passe</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        </form>
      </div>
    </div>
  );
}