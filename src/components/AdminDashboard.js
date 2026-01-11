import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard({ onLogout }) {
  const [data, setData] = useState({ etudiants: [], matieres: [], notes: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etudiants, matieres, notes] = await Promise.all([
          api.get('/etudiants').then(r => r.data),
          api.get('/matieres').then(r => r.data),
          api.get('/notes').then(r => r.data)
        ]);
        setData({ etudiants, matieres, notes });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <span className="navbar-brand">Espace Administrateur</span>
        <button className="btn btn-outline-light" onClick={onLogout}>Déconnexion</button>
      </nav>
      <h4>Gestion des données</h4>

      <h5>Étudiants ({data.etudiants.length})</h5>
      <table className="table table-sm">
        <thead><tr><th>Nom</th><th>Email</th></tr></thead>
        <tbody>
          {data.etudiants.map(e => (
            <tr key={e._id}><td>{e.nom}</td><td>{e.email}</td></tr>
          ))}
        </tbody>
      </table>

      <h5>Matières ({data.matieres.length})</h5>
      <table className="table table-sm">
        <thead><tr><th>Nom</th><th>Enseignant</th></tr></thead>
        <tbody>
          {data.matieres.map(m => (
            <tr key={m._id}><td>{m.nom}</td><td>{m.enseignant?.nom || '–'}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}