import { Typography } from '@mui/material';
import BabyjubDashboard from 'src/pages-view/guardian-account/babyjub-dashboard';
import ConfirmRecovery from 'src/pages-view/guardian-account/confirm-recovery';

export default function GuardianAccount() {
  return (
    <>
      <Typography variant="subtitle1">Guardians Account</Typography>
      <BabyjubDashboard />
      <ConfirmRecovery />
    </>
  );
}
