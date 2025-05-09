import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import capibaraImg from '../../assets/capibara.webp';
import { homeContainerStyle } from './styles';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" sx={homeContainerStyle}>
      <Box mb={3}>
        <img
          src={capibaraImg}
          alt="Capibara"
          style={{ maxWidth: 220, width: '100%', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        />
      </Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Bienvenido a Inzigne
      </Typography>
      <Typography variant="body1" align="center">
        Has iniciado sesión como: {currentUser?.email}
      </Typography>
    </Box>
  );
};

export default Home; 