import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  Box,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { contentData } from '../data/contentData';
import { useAvaxPrice } from '../hooks/useAvaxPrice';
import Snackbar from '@mui/material/Snackbar';

const INCENTIVES = [
  { label: 'Básico', value: '0.00000' },
  { label: 'Avanzado', value: '0.00000' },
  { label: 'Épico', value: '0.00000' },
];

function formatCOP(value: number) {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

const ContentDetail: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState(INCENTIVES);
  const { price: avaxPrice, loading: avaxLoading, error: avaxError } = useAvaxPrice();
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const category = contentData.find(cat => cat.title === categoryId);
  const subcategory = category?.items[parseInt(subcategoryId || '0')];

  if (!category || !subcategory) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          Contenido no encontrado
        </Typography>
      </Container>
    );
  }

  const handleIncentiveChange = (index: number, value: string) => {
    // Permitir solo números y hasta 5 decimales
    if (/^\d*(\.\d{0,5})?$/.test(value) || value === '') {
      const newIncentives = [...incentives];
      newIncentives[index].value = value;
      setIncentives(newIncentives);
    }
  };

  const handleStart = async () => {
    setLoadingPDF(true);
    try {
      const response = await fetch('http://localhost:4000/api/groq-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: subcategory.title,
          category: category.title,
        }),
      });
      if (!response.ok) {
        alert('Error al generar el PDF');
        setLoadingPDF(false);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${subcategory.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setOpenSnackbar(true);
    } catch (err) {
      alert('Error al generar el PDF');
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/contenido')}
          variant="outlined"
          color="primary"
        >
          Volver al contenido
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {subcategory.title}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {category.title}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Descripción
        </Typography>
        <Typography variant="body1" paragraph>
          {subcategory.description}
        </Typography>

        {/* Nueva sección de incentivos */}
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            ¡Vamos a aprender!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Elige los incentivos:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {incentives.map((item, idx) => {
              const avax = parseFloat(item.value) || 0;
              const cop = avaxPrice ? avax * avaxPrice : 0;
              return (
                <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {item.label}
                    </Typography>
                    <TextField
                      value={item.value}
                      onChange={e => handleIncentiveChange(idx, e.target.value)}
                      inputProps={{
                        inputMode: 'decimal',
                        pattern: '^\\d*(\\.\\d{0,5})?$',
                        style: { textAlign: 'center', fontFamily: 'monospace', fontSize: 24 },
                      }}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                    <Typography variant="body2" color="text.secondary">
                      AVAX
                    </Typography>
                    {avaxLoading ? (
                      <Box mt={1}><CircularProgress size={18} /></Box>
                    ) : avaxError ? (
                      <Typography variant="caption" color="error">No se pudo obtener el precio</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        aprox {formatCOP(cop)} COP
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          <Box mt={4} textAlign="center">
            {loadingPDF ? (
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">Generando PDF...</Typography>
              </Box>
            ) : (
              <Button variant="contained" color="primary" size="large" onClick={handleStart}>
                Empezar!
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Reto Iniciado!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
};

export default ContentDetail; 