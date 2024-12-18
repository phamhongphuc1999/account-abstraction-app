import { SearchOutlined } from '@mui/icons-material';
import { TextField, TextFieldProps } from '@mui/material';

export function SearchTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      slotProps={{ input: { startAdornment: <SearchOutlined sx={{ color: 'text.secondary' }} /> } }}
    />
  );
}
