import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import ChipsInput from './ChipsInput';

interface Option {
  [key: string]: string;
  texto: string;
}

interface ChipWithTextProps<T extends Option> {
  title: string;
  placeholder: string;
  options: T[];
  selectedOption: string;
  optionText: string;
  onOptionsChange: (options: T[]) => void;
  onSelectedOptionChange: (value: string) => void;
  onOptionTextChange: (value: string) => void;
  valueKey: string;
}

const ChipWithText = <T extends Option>({
  title,
  placeholder,
  options,
  selectedOption,
  optionText,
  onOptionsChange,
  onSelectedOptionChange,
  onOptionTextChange,
  valueKey
}: ChipWithTextProps<T>) => {
  return (
    <Box sx={{ mb: 3 }}>
      <ChipsInput
        title={title}
        placeholder={placeholder}
        initialValues={options.map(o => o[valueKey])}
        onChange={(values) => {
          // Mantener las opciones existentes con sus textos
          const currentOptions = options.filter(o => 
            values.includes(o[valueKey])
          );
          
          // Agregar nuevas opciones con texto vacío
          const newOptions = values
            .filter(v => !options.some(o => o[valueKey] === v))
            .map(v => ({ [valueKey]: v, texto: '' } as T));
          
          onOptionsChange([...currentOptions, ...newOptions]);

          // Si la opción seleccionada fue eliminada, limpiar la selección
          if (!values.includes(selectedOption)) {
            onSelectedOptionChange('');
            onOptionTextChange('');
          }
        }}
      />
      <FormControl fullWidth size="small" sx={{ mt: 2 }}>
        <InputLabel>{`Seleccionar ${title.toLowerCase()}`}</InputLabel>
        <Select
          value={selectedOption}
          onChange={(e) => {
            const newValue = e.target.value;
            onSelectedOptionChange(newValue);
            // Buscar el texto existente para esta opción
            const option = options.find(o => o[valueKey] === newValue);
            onOptionTextChange(option?.texto || '');
          }}
          label={`Seleccionar ${title.toLowerCase()}`}
        >
          <MenuItem value=""><em>Ninguno</em></MenuItem>
          {options.map((o) => (
            <MenuItem key={o[valueKey]} value={o[valueKey]}>
              {o[valueKey]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder={`Texto del ${title.toLowerCase()}...`}
        value={optionText}
        onChange={(e) => {
          const newText = e.target.value;
          onOptionTextChange(newText);
          // Actualizar el texto en la opción actual manteniendo las demás opciones intactas
          const updatedOptions = options.map(o => 
            o[valueKey] === selectedOption 
              ? { ...o, texto: newText } as T
              : o
          );
          onOptionsChange(updatedOptions);
        }}
        disabled={!selectedOption}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default ChipWithText; 