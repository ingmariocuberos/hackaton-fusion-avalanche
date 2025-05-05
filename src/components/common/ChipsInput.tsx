import React, { useState, KeyboardEvent } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';

interface ChipsInputProps {
  title: string;
  placeholder?: string;
  initialValues?: string[];
  onChange?: (values: string[]) => void;
}

const ChipsInput: React.FC<ChipsInputProps> = ({
  title,
  placeholder = 'Añadir valor',
  initialValues = [],
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<string[]>(initialValues);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isDuplicate = (value: string) => {
    return chips.some(chip => chip.toLowerCase() === value.toLowerCase());
  };

  const handleAddChip = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      if (isDuplicate(trimmedValue)) {
        Swal.fire({
          title: 'Valor duplicado',
          text: 'Este valor ya existe en la lista',
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: theme.palette.primary.main
        });
        return;
      }
      const newChips = [...chips, trimmedValue];
      setChips(newChips);
      setInputValue('');
      onChange?.(newChips);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddChip();
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    const newChips = chips.filter((chip) => chip !== chipToDelete);
    setChips(newChips);
    onChange?.(newChips);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography
        variant="subtitle1"
        component="label"
        sx={{ mb: 1, display: 'block', fontWeight: 'medium' }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <TextField
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          size="small"
        />
        <IconButton
          onClick={handleAddChip}
          color="primary"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            ...(isMobile && {
              alignSelf: 'flex-end',
              mt: 1
            })
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {chips.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 2,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
          }}
        >
          {chips.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              onDelete={() => handleDeleteChip(chip)}
              deleteIcon={<CloseIcon />}
              sx={{
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'white',
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ChipsInput; 