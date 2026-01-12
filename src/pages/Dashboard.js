import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    grades: 0,
    average: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        if (user?.role === 'admin') {
          const [students, subjects, grades, kpi] = await Promise.all([
            api.get('/students').then(r => r.data),
            api.get('/subjects').then(r => r.data),
            api.get('/grades').then(r => r.data),
            api.get('/stats/kpi').then(r => r.data)
          ]);
          setStats({
            students: students.length,
            subjects: subjects.length,
            grades: grades.length,
            average: kpi.moyenneGlobale || 0
          });
        } else if (user?.role === 'enseignant') {
          const [subjects, statsData] = await Promise.all([
            api.get('/subjects').then(r => r.data),
            api.get('/stats/subjects').then(r => r.data)
          ]);
          const avg = statsData.length > 0
            ? statsData.reduce((sum, s) => sum + s.moyenne, 0) / statsData.length
            : 0;
          setStats({
            students: 0,
            subjects: subjects.length,
            grades: 0,
            average: avg
          });
        } else if (user?.role === 'etudiant') {
          const students = await api.get('/students').then(r => r.data);
          if (students.length > 0) {
            const student = students[0];
            const grades = await api.get(`/grades/student/${student._id}`).then(r => r.data);
            const avg = grades.length > 0
              ? grades.reduce((sum, g) => sum + g.note, 0) / grades.length
              : 0;
            setStats({
              students: 1,
              subjects: 0,
              grades: grades.length,
              average: avg
            });
          }
        }
      } catch (error) {
        // Silent error handling for dashboard - show default values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: user?.role === 'admin' ? 'Étudiants' : user?.role === 'etudiant' ? 'Mon Profil' : 'Matières',
      value: user?.role === 'admin' ? stats.students : user?.role === 'etudiant' ? 'Actif' : stats.subjects,
      icon: 'bi-people',
      color: 'primary',
      link: user?.role === 'admin' ? '/students' : user?.role === 'enseignant' ? '/subjects' : '/my-grades'
    },
    {
      title: user?.role === 'admin' ? 'Matières' : user?.role === 'etudiant' ? 'Mes Notes' : 'Statistiques',
      value: user?.role === 'admin' ? stats.subjects : user?.role === 'etudiant' ? stats.grades : 'Voir',
      icon: user?.role === 'admin' ? 'bi-book' : user?.role === 'etudiant' ? 'bi-journal-text' : 'bi-bar-chart',
      color: 'success',
      link: user?.role === 'admin' ? '/subjects' : user?.role === 'etudiant' ? '/my-grades' : '/statistics'
    },
    {
      title: user?.role === 'admin' ? 'Notes' : 'Moyenne',
      value: user?.role === 'admin' ? stats.grades : stats.average.toFixed(2),
      icon: user?.role === 'admin' ? 'bi-clipboard-data' : 'bi-graph-up',
      color: 'info',
      link: user?.role === 'admin' ? '/grades' : '/statistics'
    },
    {
      title: user?.role === 'admin' ? 'Moyenne Globale' : 'Statistiques',
      value: user?.role === 'admin' ? stats.average.toFixed(2) : 'Voir',
      icon: 'bi-bar-chart',
      color: 'warning',
      link: '/statistics'
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Tableau de bord</h2>
          <p className="text-muted">Bienvenue dans votre espace de suivi académique</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className={`card border-0 shadow-sm h-100 bg-${card.color} text-white`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">{card.title}</h6>
                    <h2 className="card-title mb-0 fw-bold">{card.value}</h2>
                  </div>
                  <div className={`bg-white bg-opacity-25 rounded-circle p-3`}>
                    <i className={`bi ${card.icon} fs-4`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold">Aperçu rapide</h5>
              <p className="text-muted">
                Utilisez le menu de navigation pour accéder aux différentes sections et consulter les données détaillées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

