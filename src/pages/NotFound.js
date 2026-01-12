import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card border-0 shadow">
            <div className="card-body py-5">
              <h1 className="display-1 fw-bold text-primary">404</h1>
              <h4 className="mb-3">Page non trouvée</h4>
              <p className="text-muted mb-4">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-house me-2"></i>Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


