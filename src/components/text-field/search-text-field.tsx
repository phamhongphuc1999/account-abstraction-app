import { SearchOutlined } from '@mui/icons-material';
import { TextField, TextFieldProps } from '@mui/material';

export interface SearchTextFieldProps {
  props?: TextFieldProps;
}

export function SearchTextField({ props }: SearchTextFieldProps) {
  return (
    <TextField
      {...props}
      InputProps={{ startAdornment: <SearchOutlined sx={{ color: 'text.secondary' }} /> }}
    />
  );
}
