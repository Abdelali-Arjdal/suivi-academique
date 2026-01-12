import React, { useCallback, useEffect, useState } from 'react';
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
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = ({ user }) => {
  const [stats, setStats] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      if (user?.role === 'admin' || user?.role === 'enseignant') {
        const [subjectsStats, kpiData] = await Promise.all([
          api.get('/stats/subjects').then(r => r.data),
          api.get('/stats/kpi').then(r => r.data)
        ]);
        setStats(subjectsStats);
        setKpi(kpiData);
      } else if (user?.role === 'etudiant') {
        const students = await api.get('/students').then(r => r.data);
        if (students.length > 0) {
          const student = students[0];
          const grades = await api.get(`/grades/student/${student._id}`).then(r => r.data);
          const subjectGrades = {};
          grades.forEach(grade => {
            const subjectName = grade.subjectId?.nom || 'Unknown';
            if (!subjectGrades[subjectName]) {
              subjectGrades[subjectName] = [];
            }
            subjectGrades[subjectName].push(grade.note);
          });
          const studentStats = Object.entries(subjectGrades).map(([nom, notes]) => ({
            matiere: nom,
            moyenne: notes.reduce((a, b) => a + b, 0) / notes.length,
            min: Math.min(...notes),
            max: Math.max(...notes)
          }));
          setStats(studentStats);
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <LoadingSpinner message="Chargement des statistiques..." />;
  }

  const chartData = {
    labels: stats.map(s => s.matiere || s.nomMatiere),
    datasets: [
      {
        label: 'Moyenne',
        data: stats.map(s => s.moyenne),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      },
      {
        label: 'Minimum',
        data: stats.map(s => s.min),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
      },
      {
        label: 'Maximum',
        data: stats.map(s => s.max),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Statistiques</h2>
          <p className="text-muted">Analyse des performances académiques</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchStats} />}

      {kpi && (
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Moyenne Globale</h6>
                <h2 className="fw-bold text-primary">{kpi.moyenneGlobale?.toFixed(2) || 0}/20</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Taux de Réussite</h6>
                <h2 className="fw-bold text-success">{kpi.tauxReussiteGlobal?.toFixed(2) || 0}%</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Évaluations</h6>
                <h2 className="fw-bold text-info">{kpi.nbTotalEvaluations || 0}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Statistiques par Matière</h5>
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Détails par Matière</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Matière</th>
                      <th>Moyenne</th>
                      <th>Minimum</th>
                      <th>Maximum</th>
                      {stats[0]?.tauxReussite !== undefined && <th>Taux de Réussite</th>}
                      {stats[0]?.nbEtudiants !== undefined && <th>Étudiants</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{stat.matiere || stat.nomMatiere}</td>
                        <td>{stat.moyenne.toFixed(2)}/20</td>
                        <td>{stat.min}/20</td>
                        <td>{stat.max}/20</td>
                        {stat.tauxReussite !== undefined && (
                          <td>
                            <span className={`badge ${stat.tauxReussite >= 50 ? 'bg-success' : 'bg-warning'}`}>
                              {stat.tauxReussite.toFixed(2)}%
                            </span>
                          </td>
                        )}
                        {stat.nbEtudiants !== undefined && <td>{stat.nbEtudiants}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
