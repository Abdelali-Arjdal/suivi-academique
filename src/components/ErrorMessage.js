import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <i className="bi bi-exclamation-triangle me-2"></i>
      <strong>Erreur:</strong> {message}
      {onRetry && (
        <button
          type="button"
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={onRetry}
        >
          Réessayer
        </button>
      )}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
};

export default ErrorMessage;


