import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Content from './pages/Content';
import ContentDetail from './pages/ContentDetail';
import Login from './pages/Login';
import { PrivyProvider } from '@privy-io/react-auth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Ruta privada - redirige a /login si no hay usuario autenticado
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Ruta pública - redirige a / si hay usuario autenticado
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <PrivyProvider appId="cma9xwkey029wic0mivacgcbq"
     config={{
      appearance: {
        walletList: ['detected_ethereum_wallets']
      } 
     }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route
                  path="/contenido"
                  element={
                    <PrivateRoute>
                      <Content />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contenido/:categoryId/:subcategoryId"
                  element={
                    <PrivateRoute>
                      <ContentDetail />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </PrivyProvider>
  );
};

export default App; 