import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-graph-up me-2"></i>
          Suivi Académique
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>Tableau de bord
              </Link>
            </li>
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/students">
                    <i className="bi bi-people me-1"></i>Étudiants
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/subjects">
                    <i className="bi bi-book me-1"></i>Matières
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/grades">
                    <i className="bi bi-clipboard-data me-1"></i>Notes
                  </Link>
                </li>
              </>
            )}
            {(user?.role === 'admin' || user?.role === 'enseignant') && (
              <li className="nav-item">
                <Link className="nav-link" to="/statistics">
                  <i className="bi bi-bar-chart me-1"></i>Statistiques
                </Link>
              </li>
            )}
            {user?.role === 'etudiant' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-grades">
                    <i className="bi bi-journal-text me-1"></i>Mes Notes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/statistics">
                    <i className="bi bi-graph-up me-1"></i>Mes Statistiques
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              <i className="bi bi-person-circle me-1"></i>
              {user?.role === 'admin' ? 'Administrateur' : 
               user?.role === 'enseignant' ? 'Enseignant' : 'Étudiant'}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


