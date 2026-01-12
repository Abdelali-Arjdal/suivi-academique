import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns = [
    {
      key: 'cne',
      label: 'CNE',
      sortable: true
    },
    {
      key: 'prenom',
      label: 'Prénom',
      sortable: true
    },
    {
      key: 'nom',
      label: 'Nom',
      sortable: true
    },
    {
      key: 'filiere',
      label: 'Filière',
      sortable: true
    },
    {
      key: 'niveau',
      label: 'Niveau',
      sortable: true
    },
    {
      key: 'groupe',
      label: 'Groupe',
      sortable: true
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement des étudiants..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Gestion des Étudiants</h2>
          <p className="text-muted">Liste complète des étudiants enregistrés</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchStudents} />}

      <DataTable
        data={students}
        columns={columns}
        title={`Étudiants (${students.length})`}
        searchable={true}
        pageSize={15}
      />
    </div>
  );
};

export default Students;

