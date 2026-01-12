import React from 'react';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-muted">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;


