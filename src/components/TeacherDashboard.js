import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TeacherDashboard({ onLogout }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/statistiques/enseignant');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <span className="navbar-brand">Espace Enseignant</span>
        <button className="btn btn-outline-light" onClick={onLogout}>Déconnexion</button>
      </nav>
      <h4>Statistiques par matière</h4>
      {stats.map((s) => {
        if (!s || typeof s.moyenne !== 'number') return null;
        return (
          <div className="card mb-3" key={s.matiereId}>
            <div className="card-body">
              <h5>{s.matiere}</h5>
              <p>Moyenne : {s.moyenne.toFixed(2)} | Min : {s.min} | Max : {s.max} | Étudiants : {s.nbEtudiants}</p>
              <Bar
                data={{
                  labels: ['Moyenne', 'Min', 'Max'],
                  datasets: [{
                    label: 'Notes',
                    data: [s.moyenne, s.min, s.max],  // ✅ CORRECTION : "data:" ajouté
                    backgroundColor: ['#4e73df', '#f6c23e', '#e74a3b']
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}