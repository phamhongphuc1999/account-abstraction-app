import { Typography } from '@mui/material';
import HashRegisterProvider from 'src/context/hash-register-context';
import RegisterForm from 'src/pages-view/hash-system-register/register-form';

export default function HashSystemRegister() {
  return (
    <HashRegisterProvider>
      <Typography variant="subtitle1">Hash Register</Typography>
      <RegisterForm props={{ sx: { mt: 2 } }} />
    </HashRegisterProvider>
  );
}
