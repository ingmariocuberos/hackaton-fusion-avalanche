import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido
      </Typography>
      <Typography variant="body1">
        Has iniciado sesión como: {currentUser?.email}
      </Typography>
    </Box>
  );
};

export default Home; 