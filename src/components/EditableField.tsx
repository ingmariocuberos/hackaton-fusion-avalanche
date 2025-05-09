import React, { useRef, useEffect } from 'react';
import { Typography } from '@mui/material';

interface EditableFieldProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ title, value, onChange, onFocus }) => {
  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (textFieldRef.current && !isInternalChange.current) {
      const selection = window.getSelection();
      let cursorPosition = 0;

      if (selection && selection.rangeCount > 0) {
        try {
          const range = selection.getRangeAt(0);
          if (textFieldRef.current.contains(range.commonAncestorContainer)) {
            cursorPosition = range.startOffset;
          }
        } catch (e) {
          console.log('Error al obtener la posición del cursor:', e);
        }
      }
      
      textFieldRef.current.innerHTML = value;
      
      if (textFieldRef.current.firstChild && selection) {
        try {
          const range = document.createRange();
          const textNode = textFieldRef.current.firstChild;
          const maxLength = textNode.textContent?.length || 0;
          
          cursorPosition = Math.min(cursorPosition, maxLength);
          
          range.setStart(textNode, cursorPosition);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          console.log('Error al restaurar el cursor:', e);
        }
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    isInternalChange.current = true;
    onChange(e.currentTarget.innerHTML);
  };

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

      <div
        contentEditable
        ref={textFieldRef}
        onInput={handleInput}
        onFocus={onFocus}
        style={{
          width: '100%',
          minHeight: '100px',
          border: '1px solid #ccc',
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: '#fafafa',
          overflow: 'auto',
          lineHeight: '1.5',
          marginBottom: '16px'
        }}
      />
    </>
  );
};

export default EditableField; 