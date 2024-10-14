import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';

export default function PasswordTextField(props: TextFieldProps) {
  const [isVisibility, setIsVisibility] = useState(false);

  return (
    <TextField
      {...props}
      slotProps={{
        input: {
          type: isVisibility ? 'text' : 'password',
          endAdornment: (
            <IconButton onClick={() => setIsVisibility((preValue) => !preValue)}>
              {isVisibility ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
            </IconButton>
          ),
        },
      }}
    />
  );
}
