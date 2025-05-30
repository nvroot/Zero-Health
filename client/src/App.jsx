import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import PatientPortal from './components/PatientPortal.jsx';
import StaffDashboard from './components/StaffDashboard.jsx';
import './App.css';

// Deliberately vulnerable: No proper authentication check
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// Get user role from localStorage
const getUserRole = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const parsed = JSON.parse(userData);
    return (parsed.user && parsed.user.role) || parsed.role || 'patient';
  }
  return null;
};

const PrivateRoute = ({ children }) => {
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
    }
  }, []);
  
  return isAuthenticated() ? children : null;
};

// Role-based dashboard component
const RoleBasedDashboard = () => {
  const userRole = getUserRole();
  
  if (userRole === 'doctor' || userRole === 'pharmacist') {
    return <StaffDashboard />;
  } else {
    return <PatientPortal />;
  }
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <RoleBasedDashboard />
              </PrivateRoute>
            } 
          />
          {/* Legacy dashboard route for backward compatibility */}
          <Route 
            path="/old-dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          {/* Direct access routes (deliberately insecure) */}
          <Route 
            path="/patient-portal" 
            element={
              <PrivateRoute>
                <PatientPortal />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/staff-dashboard" 
            element={
              <PrivateRoute>
                <StaffDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 