import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { contentData } from '../data/contentData';

const INCENTIVES = [
  { label: 'Básico', value: 0.00000 },
  { label: 'Avanzado', value: 0.00000 },
  { label: 'Épico', value: 0.00000 },
];

const ContentDetail: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();

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
            {INCENTIVES.map((item) => (
              <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontFamily: 'monospace', mb: 1 }}>
                    {item.value.toFixed(5)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AVAX
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContentDetail; 