import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const MyGrades = () => {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const studentsRes = await api.get('/students');
      if (studentsRes.data && studentsRes.data.length > 0) {
        const studentData = studentsRes.data[0];
        setStudent(studentData);
        
        const gradesRes = await api.get(`/grades/student/${studentData._id}`);
        setGrades(gradesRes.data);
        
        if (gradesRes.data.length > 0) {
          const total = gradesRes.data.reduce((sum, g) => sum + (g.note || 0), 0);
          setAverage(total / gradesRes.data.length);
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de vos notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Chargement des notes..." />;
  }

  const chartData = {
    labels: grades.map(g => g.subjectId?.nom || 'Subject'),
    datasets: [
      {
        label: 'Notes',
        data: grades.map(g => g.note),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Mes Notes</h2>
          <p className="text-muted">Consultation de vos notes et résultats</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {student && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Moyenne Générale</h6>
                <h1 className="fw-bold text-primary">{average.toFixed(2)}/20</h1>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-3">Informations Personnelles</h6>
                <div className="row">
                  <div className="col-6">
                    <p className="mb-1"><strong>Nom:</strong> {student.nom}</p>
                    <p className="mb-1"><strong>Prénom:</strong> {student.prenom}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-1"><strong>CNE:</strong> {student.cne}</p>
                    <p className="mb-1"><strong>Filière:</strong> {student.filiere} - {student.niveau}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Évolution des Notes</h5>
              {grades.length > 0 ? (
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
              ) : (
                <p className="text-muted text-center py-5">Aucune note disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Détail des Notes</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Matière</th>
                      <th>Note</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          Aucune note disponible
                        </td>
                      </tr>
                    ) : (
                      grades.map(g => (
                        <tr key={g._id}>
                          <td className="fw-bold">{g.subjectId?.nom || 'N/A'}</td>
                          <td>
                            <span className={`badge ${g.note >= 10 ? 'bg-success' : 'bg-danger'}`}>
                              {g.note}/20
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {g.type === 'control' ? 'Contrôle' : 'Examen'}
                            </span>
                          </td>
                          <td>{new Date(g.date).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      ))
                    )}
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

export default MyGrades;
