import { Box, Button, Typography } from '@mui/material';
import ReactSeo from 'src/components/ReactSeo';
import { MuiLink } from 'src/components/utils';
import BJJDashboard from 'src/pages-view/guardian-account/bjj-dashboard';
import ConfirmRecovery from 'src/pages-view/guardian-account/confirm-recovery';

export default function GuardianAccount() {
  return (
    <>
      <ReactSeo title="Guardian Account" />
      <Typography variant="subtitle1">Guardians Account</Typography>
      <BJJDashboard />
      <ConfirmRecovery />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <MuiLink to="/baby-jub/register">
          <Button variant="outlined" sx={{ mt: 1, minWidth: '200px' }}>
            Create another Account
          </Button>
        </MuiLink>
        <MuiLink to="/baby-jub/import">
          <Button variant="outlined" sx={{ mt: 1, minWidth: '200px' }}>
            Import another Account
          </Button>
        </MuiLink>
      </Box>
    </>
  );
}
