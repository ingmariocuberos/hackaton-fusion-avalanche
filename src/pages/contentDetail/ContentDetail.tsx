import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAvaxPrice } from '../../hooks/useAvaxPrice';
import Snackbar from '@mui/material/Snackbar';
import { contentDetailContainerStyle } from './styles';
import { contentData } from '../../data/contentData';
import { apiService } from '../../global/standardService/apiService';
import { getFilesFromStorage } from '../../services/files/filesService';
import { createMotivationalPDF } from '../../global/pdf-creation/createMotivationalPdf';
const INCENTIVES = [
  { label: 'Básico', value: '0.00000' },
  { label: 'Avanzado', value: '0.00000' },
  { label: 'Épico', value: '0.00000' },
];

function formatCOP(value: number) {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

const validationSchema = Yup.object().shape({
  studentName: Yup.string()
    .required('El nombre del estudiante es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(30, 'El nombre no puede tener más de 30 caracteres')
});

const ContentDetail: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState(INCENTIVES);
  const { price: avaxPrice, loading: avaxLoading, error: avaxError } = useAvaxPrice();
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    if (/^\d*(\.\d{0,5})?$/.test(value) || value === '') {
      const newIncentives = [...incentives];
      newIncentives[index].value = value;
      setIncentives(newIncentives);
    }
  };

  const handleStart = async (values: { studentName: string }) => {
    setLoadingPDF(true);
    try {
      console.log("handleStart called");
      await getFilesFromStorage(subcategory.title);
      const groqResponse = await apiService.post<{ data: { pdfContent: string } }>('groqPdf', {
        topic: subcategory.title,
        category: category.title,
      }, {
        'Content-Type': 'application/json'
      });
      const pdfContent = groqResponse.data.pdfContent;

      const pdfBlob = createMotivationalPDF(pdfContent, subcategory, category, incentives);

      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Motivación.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error en handleStart:', err);
      alert('Error al generar el PDF');
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ ...contentDetailContainerStyle, paddingTop: '80px', paddingBottom: isMobile ? '32px' : undefined }}>
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

        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            ¡Vamos a aprender!
          </Typography>
          <Formik
            initialValues={{ studentName: '' }}
            validationSchema={validationSchema}
            onSubmit={handleStart}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Nombre del estudiante:
                </Typography>
                <Field
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  name="studentName"
                  error={touched.studentName && Boolean(errors.studentName)}
                  helperText={touched.studentName && errors.studentName}
                  sx={{ marginBottom: 3 }}
                  autoComplete="off"
                />
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
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      type="submit"
                      disabled={!(isValid && dirty)}
                    >
                      Empezar!
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
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