import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Container 
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { loginContainerStyle } from './styles';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={loginContainerStyle}>
        <Typography component="h1" variant="h5" align="center">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 