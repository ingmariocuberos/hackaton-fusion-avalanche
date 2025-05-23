import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper
} from '@mui/material';
import { 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../external/formik';
import { object, string } from 'yup';

const Register: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: async (values) => {
      try {
        if (values.password !== values.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        navigate('/');
      } catch (err) {
        setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
      }
    },
    validationSchema: object({
      email: string().email().required(),
      password: string().min(6).required(),
      confirmPassword: string().required()
    })
  });

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
          autoComplete="new-password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.password && Boolean(form.errors.password)}
          helperText={form.touched.password && form.errors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.confirmPassword && Boolean(form.errors.confirmPassword)}
          helperText={form.touched.confirmPassword && form.errors.confirmPassword}
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
          Registrarse
        </Button>
      </Box>
    </Paper>
  );
};

export default Register; 