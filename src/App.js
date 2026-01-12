import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Layout/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Subjects from './pages/Subjects';
import Grades from './pages/Grades';
import Statistics from './pages/Statistics';
import MyGrades from './pages/MyGrades';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ token, role });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        {children}
      </>
    );
  };

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['admin', 'enseignant', 'etudiant']}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Students />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/subjects"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Subjects />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/grades"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Grades />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/statistics"
          element={
            <ProtectedRoute allowedRoles={['admin', 'enseignant', 'etudiant']}>
              <Statistics user={user} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-grades"
          element={
            <ProtectedRoute allowedRoles={['etudiant']}>
              <MyGrades />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="*"
          element={
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <NotFound />
            </>
          }
        />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
