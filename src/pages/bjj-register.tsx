import { Typography } from '@mui/material';
import HashRegisterProvider from 'src/context/hash-register-context';
import BJJRegisterView from 'src/pages-view/bjj-register-view';

export default function BJJRegister() {
  return (
    <HashRegisterProvider>
      <Typography variant="subtitle1">Hash Register</Typography>
      <BJJRegisterView props={{ sx: { mt: 2 } }} />
    </HashRegisterProvider>
  );
}
