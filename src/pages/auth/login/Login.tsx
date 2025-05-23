import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Divider 
} from '@mui/material';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../external/formik';
import { object, string } from 'yup';
import GoogleIcon from '@mui/icons-material/Google';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate('/');
      } catch (err) {
        setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    },
    validationSchema: object({
      email: string().email().required(),
      password: string().min(6).required()
    })
  });

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box component="form" onSubmit={form.handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.email && Boolean(form.errors.email)}
          helperText={form.touched.email && form.errors.email}
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
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.password && Boolean(form.errors.password)}
          helperText={form.touched.password && form.errors.password}
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
          disabled={form.isSubmitting || !form.isValid || !form.touched}
        >
          Iniciar Sesión
        </Button>

        <Divider sx={{ my: 2 }}>O continuar con</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ mb: 2 }}
        >
          Continuar con Google
        </Button>
      </Box>
    </Paper>
  );
};

export default Login; 