import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { PrivyProvider } from '@privy-io/react-auth';
import AppRoutes from './router';
import { materialUiTheme } from './UI/material-ui-theme';

const App: React.FC = () => {
  const privyAppId = process.env.REACT_APP_PRIVY_APP_ID || '';
  return (
    <PrivyProvider appId={privyAppId}>
      <ThemeProvider theme={materialUiTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </PrivyProvider>
  );
};

export default App; 