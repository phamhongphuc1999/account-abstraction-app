import { Typography } from '@mui/material';
import HashRegisterProvider from 'src/context/hash-register-context';
import BabyjubRegisterView from 'src/pages-view/babyjub-register-view';

export default function BabyjubRegister() {
  return (
    <HashRegisterProvider>
      <Typography variant="subtitle1">Hash Register</Typography>
      <BabyjubRegisterView props={{ sx: { mt: 2 } }} />
    </HashRegisterProvider>
  );
}
