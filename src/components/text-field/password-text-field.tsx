import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
            {isVisibility ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
          </IconButton>
        ),
      }}
    />
  );
}
