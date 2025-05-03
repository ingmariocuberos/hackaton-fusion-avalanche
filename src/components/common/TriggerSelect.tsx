import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box, Divider } from '@mui/material';

interface TriggerSelectProps {
  title: string;
  value: string;
  alias: string | null;
  options: string[];
  onTriggerChange: (value: string) => void;
  onAliasChange: (alias: string) => void;
}

const TriggerSelect: React.FC<TriggerSelectProps> = ({
  title,
  value,
  alias,
  options,
  onTriggerChange,
  onAliasChange
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2, py: 2 }}>
        <TextField
          fullWidth
          label={`Alias para ${title}`}
          value={alias || ''}
          onChange={(e) => onAliasChange(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel>{title}</InputLabel>
          <Select
            value={value}
            label={title}
            onChange={(e) => onTriggerChange(e.target.value)}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default TriggerSelect; 