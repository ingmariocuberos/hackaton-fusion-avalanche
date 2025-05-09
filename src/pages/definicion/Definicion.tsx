import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import EditableField from '../components/EditableField';
import { getAuth } from 'firebase/auth';
import { encryptionHelper } from '../../utils/encryptionHelper';
import { definicionContainerStyle } from './styles';

interface Parametro {
  id: number;
  name: string;
  options: string[] | { diagnostico: string; texto: string; }[];
  type: 'chip' | 'text';
  condition: string | null;
  trigger: string | null;
  alias: string | null;
}

interface ChromeStorageResult {
  settings?: string;
}

const Definicion: React.FC = () => {
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [enfermedadActual, setEnfermedadActual] = useState('');
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const activeFieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadParametros = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          console.log('No hay usuario autenticado');
          return;
        }

        const localId = currentUser.uid;

        if (window.chrome?.storage?.sync) {
          window.chrome.storage.sync.get(['settings'], (result: ChromeStorageResult) => {
            if (result.settings) {
              try {
                const decryptedData = encryptionHelper.decrypt(result.settings, localId) as Parametro[];
                setParametros(decryptedData);
              } catch (error) {
                console.error('Error al desencriptar datos:', error);
                // Intentar cargar desde localStorage como respaldo
                loadFromLocalStorage(localId);
              }
            } else {
              // Si no hay datos en chrome.storage, intentar localStorage
              loadFromLocalStorage(localId);
            }
          });
        } else {
          // Si no está disponible chrome.storage, usar localStorage
          loadFromLocalStorage(localId);
        }
      } catch (error) {
        console.error('Error al cargar parámetros:', error);
      }
    };

    const loadFromLocalStorage = (localId: string) => {
      const savedData = localStorage.getItem('parametrizacionData');
      if (savedData) {
        try {
          const decryptedData = encryptionHelper.decrypt(savedData, localId) as Parametro[];
          setParametros(decryptedData);
        } catch (error) {
          console.error('Error al cargar datos desde localStorage:', error);
        }
      }
    };

    loadParametros();
  }, []);

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    activeFieldRef.current = event.currentTarget;
  };

  const transformText = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '');
  };

  const handleButtonClick = (name: string) => {
    const transformedName = transformText(name);
    if (activeFieldRef.current) {
      insertTextAtCursor(transformedName);
    }
  };

  const insertTextAtCursor = (text: string) => {
    if (!activeFieldRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Verificar que el rango pertenece al campo activo actual
    if (!activeFieldRef.current.contains(range.commonAncestorContainer)) {
      console.log('El cursor no está en el campo activo');
      return;
    }

    // Identificar el campo actual
    const fieldContainer = activeFieldRef.current.closest('[data-field-type]');
    const fieldType = fieldContainer?.getAttribute('data-field-type');

    // Si no es un campo válido, no hacer nada
    if (!fieldType) {
      return;
    }

    // Crear el span con el texto
    const span = document.createElement('span');
    span.contentEditable = 'false';
    span.style.color = '#0000FF';
    span.style.display = 'inline-block';
    span.style.whiteSpace = 'nowrap';
    span.style.cursor = 'default';
    span.style.userSelect = 'none';
    span.textContent = `|{${text}}|`;

    // Insertar el span
    range.deleteContents();
    range.insertNode(span);

    // Crear y posicionar el cursor después del span
    const textNode = document.createTextNode('');
    range.setStartAfter(span);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    // Actualizar el estado correspondiente basado en el campo actual
    const newContent = activeFieldRef.current.innerHTML;
    
    switch(fieldType) {
      case 'enfermedad-actual':
        setEnfermedadActual(newContent);
        break;
      case 'motivo-consulta':
        setMotivoConsulta(newContent);
        break;
    }
  };

  return (
    <Box sx={definicionContainerStyle}>
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Definición de textos
          </Typography>

          <div data-field-type="motivo-consulta">
            <EditableField
              title="Motivo de consulta"
              value={motivoConsulta}
              onChange={setMotivoConsulta}
              onFocus={handleFocus}
            />
          </div>

          <div data-field-type="enfermedad-actual">
            <EditableField
              title="Enfermedad Actual"
              value={enfermedadActual}
              onChange={setEnfermedadActual}
              onFocus={handleFocus}
            />
          </div>
        </Paper>
      </Container>

      {/* Botones sticky en la parte inferior */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 2,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'background.paper',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'primary.light',
                borderRadius: 4,
              },
            }}
          >
            {parametros.map((param) => (
              <Button
                key={param.id}
                variant="outlined"
                size="small"
                value={transformText(param.name)}
                onClick={() => handleButtonClick(param.name)}
                sx={{
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content',
                  px: 2,
                  flex: '0 0 auto',
                  ...(param.condition && {
                    color: 'success.main',
                    borderColor: 'success.main',
                    '&:hover': {
                      borderColor: 'success.dark',
                      backgroundColor: 'success.lighter',
                    }
                  })
                }}
              >
                {param.alias || param.name}
              </Button>
            ))}
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Definicion; 