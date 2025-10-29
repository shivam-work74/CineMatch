import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// 1. We import our new SessionPage
import SessionPage from './pages/SessionPage'; 

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* 2. HERE IS OUR NEW, DYNAMIC ROUTE */}
        {/* The ':joinCode' part is a URL parameter */}
        <Route path="/session/:joinCode" element={<SessionPage />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;