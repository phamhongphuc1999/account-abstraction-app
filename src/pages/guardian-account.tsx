import { Box, Button, Typography } from '@mui/material';
import { MuiLink } from 'src/components/utils';
import BJJDashboard from 'src/pages-view/guardian-account/bjj-dashboard';
import ConfirmRecovery from 'src/pages-view/guardian-account/confirm-recovery';

export default function GuardianAccount() {
  return (
    <>
      <Typography variant="subtitle1">Guardians Account</Typography>
      <BJJDashboard />
      <ConfirmRecovery />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: { xs: 'column' } }}>
        <MuiLink to="/baby-jub/register" sx={{ width: '100%' }}>
          <Button variant="outlined" sx={{ mt: 1, width: { xs: '100%' } }}>
            Create another Account
          </Button>
        </MuiLink>
        <MuiLink to="/baby-jub/import" sx={{ width: '100%' }}>
          <Button variant="outlined" sx={{ mt: 1, width: { xs: '100%' } }}>
            Import another Account
          </Button>
        </MuiLink>
      </Box>
    </>
  );
}
