import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function StudentDashboard({ onLogout }) {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo purposes, we'll get the first student
        // In a real app, you'd get the logged-in student's ID from auth
        const studentsRes = await api.get('/students');
        if (studentsRes.data && studentsRes.data.length > 0) {
          const studentData = studentsRes.data[0];
          setStudent(studentData);
          
          const gradesRes = await api.get(`/grades/student/${studentData._id}`);
          setGrades(gradesRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (grades.length > 0) {
      const total = grades.reduce((sum, g) => sum + (g.note || 0), 0);
      setAverage((total / grades.length).toFixed(2));
    }
  }, [grades]);

  const chartData = {
    labels: grades.map(g => g.subjectId?.nom || 'Subject'),
    datasets: [
      {
        label: 'Notes',
        data: grades.map(g => g.note),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <span className="navbar-brand">Espace Étudiant</span>
        <button className="btn btn-outline-light" onClick={onLogout}>Déconnexion</button>
      </nav>
      
      {student && (
        <div className="mb-4">
          <h4>{student.prenom} {student.nom}</h4>
          <p>CNE: {student.cne} | Filière: {student.filiere} | Niveau: {student.niveau}</p>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5>Moyenne Générale: {average}</h5>
        </div>
      </div>

      <h5>Mes Notes</h5>
      <div className="card mb-4">
        <div className="card-body">
          {grades.length > 0 ? (
            <Line data={chartData} options={{ responsive: true }} />
          ) : (
            <p>Aucune note disponible</p>
          )}
        </div>
      </div>

      <h5>Détail des Notes</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Matière</th>
            <th>Note</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(g => (
            <tr key={g._id}>
              <td>{g.subjectId?.nom || 'N/A'}</td>
              <td>{g.note}</td>
              <td>{g.type}</td>
              <td>{new Date(g.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

