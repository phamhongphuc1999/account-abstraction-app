import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';

interface Props {
  props?: TextFieldProps;
}

export default function PasswordTextField({ props }: Props) {
  const [isVisibility, setIsVisibility] = useState(false);

  return (
    <TextField
      {...props}
      InputProps={{
        type: isVisibility ? 'text' : 'password',
        endAdornment: (
          <IconButton onClick={() => setIsVisibility((preValue) => !preValue)}>
            {isVisibility ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
          </IconButton>
        ),
      }}
    />
  );
}
