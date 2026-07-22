import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DevisListPage } from './pages/DevisListPage';
import { CreateDevisPage } from './pages/CreateDevisPage';
import { ProduitListPage } from './pages/ProduitListPage';
import { ClientListPage } from './pages/ClientListPage';
import { UtilisateurListPage } from './pages/UtilisateurListPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/devis"
        element={
          <ProtectedRoute>
            <DevisListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/devis/nouveau"
        element={
          <ProtectedRoute>
            <CreateDevisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits"
        element={
          <ProtectedRoute>
            <ProduitListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/utilisateurs"
        element={
          <ProtectedRoute>
            <UtilisateurListPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
