import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import { PrivyProvider } from '@privy-io/react-auth';
import AppRoutes from './router';
import { materialUiTheme } from './UI/material-ui-theme';
import envs from './config/env.config';
import { setYupLocale } from './external/yup/validations';

const App: React.FC = () => {
  setYupLocale();
  const privyAppId = envs.privyAppId;
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