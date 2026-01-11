import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard({ onLogout }) {
  const [data, setData] = useState({ etudiants: [], matieres: [], notes: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etudiants, matieres, notes] = await Promise.all([
          api.get('/students').then(r => r.data),
          api.get('/subjects').then(r => r.data),
          api.get('/grades').then(r => r.data)
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
      <table className="table table-sm table-striped">
        <thead><tr><th>CNE</th><th>Nom</th><th>Prénom</th><th>Filière</th><th>Niveau</th></tr></thead>
        <tbody>
          {data.etudiants.map(e => (
            <tr key={e._id}>
              <td>{e.cne}</td>
              <td>{e.nom}</td>
              <td>{e.prenom}</td>
              <td>{e.filiere}</td>
              <td>{e.niveau}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5>Matières ({data.matieres.length})</h5>
      <table className="table table-sm table-striped">
        <thead><tr><th>Code</th><th>Nom</th><th>Semestre</th><th>Coefficient</th></tr></thead>
        <tbody>
          {data.matieres.map(m => (
            <tr key={m._id}>
              <td>{m.code}</td>
              <td>{m.nom}</td>
              <td>{m.semester}</td>
              <td>{m.coefficient}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5>Notes ({data.notes.length})</h5>
      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead><tr><th>Étudiant</th><th>Matière</th><th>Note</th><th>Type</th><th>Date</th></tr></thead>
          <tbody>
            {data.notes.slice(0, 50).map(n => (
              <tr key={n._id}>
                <td>{n.studentId?.prenom} {n.studentId?.nom}</td>
                <td>{n.subjectId?.nom}</td>
                <td>{n.note}</td>
                <td>{n.type}</td>
                <td>{new Date(n.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.notes.length > 50 && <p className="text-muted">Afficher les 50 premières notes sur {data.notes.length}</p>}
    </div>
  );
}