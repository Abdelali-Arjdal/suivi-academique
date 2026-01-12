import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGrades = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/grades');
      setGrades(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const columns = [
    {
      key: 'studentId',
      label: 'Étudiant',
      sortable: true,
      render: (value) => value ? `${value.prenom} ${value.nom}` : 'N/A'
    },
    {
      key: 'subjectId',
      label: 'Matière',
      sortable: true,
      render: (value) => value ? value.nom : 'N/A'
    },
    {
      key: 'note',
      label: 'Note',
      sortable: true,
      render: (value) => (
        <span className={`badge ${value >= 10 ? 'bg-success' : 'bg-danger'}`}>
          {value}/20
        </span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="badge bg-info text-dark">
          {value === 'control' ? 'Contrôle' : 'Examen'}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement des notes..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Gestion des Notes</h2>
          <p className="text-muted">Liste complète des notes enregistrées</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchGrades} />}

      <DataTable
        data={grades}
        columns={columns}
        title={`Notes (${grades.length})`}
        searchable={true}
        pageSize={20}
      />
    </div>
  );
};

export default Grades;

