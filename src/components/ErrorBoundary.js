import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-danger shadow">
                <div className="card-body text-center py-5">
                  <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
                  <h4 className="card-title">Une erreur est survenue</h4>
                  <p className="card-text text-muted">
                    Désolé, une erreur inattendue s'est produite. Veuillez réessayer.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      this.setState({ hasError: false, error: null });
                      window.location.href = '/';
                    }}
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


