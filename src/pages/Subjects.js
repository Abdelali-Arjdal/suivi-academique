import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des matières');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const columns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true
    },
    {
      key: 'nom',
      label: 'Nom de la matière',
      sortable: true
    },
    {
      key: 'semester',
      label: 'Semestre',
      sortable: true
    },
    {
      key: 'coefficient',
      label: 'Coefficient',
      sortable: true,
      render: (value) => <span className="badge bg-secondary">{value}</span>
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement des matières..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Gestion des Matières</h2>
          <p className="text-muted">Liste des matières enseignées</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSubjects} />}

      <DataTable
        data={subjects}
        columns={columns}
        title={`Matières (${subjects.length})`}
        searchable={true}
        pageSize={15}
      />
    </div>
  );
};

export default Subjects;

