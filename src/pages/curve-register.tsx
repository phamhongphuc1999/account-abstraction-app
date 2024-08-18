import { Typography } from '@mui/material';
import HashRegisterProvider from 'src/context/hash-register-context';
import CurveRegisterView from 'src/pages-view/curve-register-view';

export default function CurveRegister() {
  return (
    <HashRegisterProvider>
      <Typography variant="subtitle1">Hash Register</Typography>
      <CurveRegisterView sx={{ mt: 2 }} />
    </HashRegisterProvider>
  );
}
