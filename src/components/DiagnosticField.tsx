import React, { useRef } from 'react';
import { Typography, Select, MenuItem, FormControl } from '@mui/material';
import EditableField from './EditableField';

interface DiagnosticText {
  diagnostico: string;
  texto: string;
}

interface DiagnosticFieldProps {
  title: string;
  diagnosticos: string[];
  selectedDiagnostico: string;
  onDiagnosticoChange: (diagnostico: string) => void;
  diagnosticosTexto: DiagnosticText[];
  onTextoChange: (diagnostico: string, texto: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

const DiagnosticField: React.FC<DiagnosticFieldProps> = ({
  title,
  diagnosticos,
  selectedDiagnostico,
  onDiagnosticoChange,
  diagnosticosTexto,
  onTextoChange,
  onFocus
}) => {
  const handleSelectChange = (event: any) => {
    onDiagnosticoChange(event.target.value);
  };

  const currentText = diagnosticosTexto.find(d => d.diagnostico === selectedDiagnostico)?.texto || '';

  return (
    <>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          mt: 3,
          color: 'text.secondary',
          fontWeight: 500
        }}
      >
        {title}
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedDiagnostico}
          onChange={handleSelectChange}
          displayEmpty
          size="small"
        >
          <MenuItem value="" disabled>
            Seleccione un diagnóstico
          </MenuItem>
          {diagnosticos.map((diagnostico) => (
            <MenuItem key={diagnostico} value={diagnostico}>
              {diagnostico}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div
        style={{
          opacity: selectedDiagnostico ? 1 : 0.5,
          pointerEvents: selectedDiagnostico ? 'auto' : 'none'
        }}
      >
        <EditableField
          title=""
          value={currentText}
          onChange={(newText) => onTextoChange(selectedDiagnostico, newText)}
          onFocus={onFocus}
        />
      </div>
    </>
  );
};

export default DiagnosticField; 