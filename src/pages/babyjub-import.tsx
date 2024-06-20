import { Typography } from '@mui/material';
import HashRegisterProvider from 'src/context/hash-register-context';

export default function BabyjubImport() {
  return (
    <HashRegisterProvider>
      <Typography variant="subtitle1">Hash Import</Typography>
    </HashRegisterProvider>
  );
}
