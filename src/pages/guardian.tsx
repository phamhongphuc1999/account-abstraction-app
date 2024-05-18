import { Box, Typography } from '@mui/material';
import GuardianConfig from 'src/pages-view/guardian/guardian-config';
import GuardianDashboard from 'src/pages-view/guardian/guardian-dashboard';
import GuardianDeployment from 'src/pages-view/guardian/guardian-deployment';
import { useAppSelector } from 'src/redux-slices/hook';

export default function Guardian() {
  const { deployType, configType } = useAppSelector((state) => state.guardian);

  return (
    <Box>
      <Typography variant="subtitle1">Guardians</Typography>
      {deployType == 'notDeploy' && <GuardianDeployment props={{ sx: { mt: 2 } }} />}
      {deployType == 'deployed' && configType == 'notConfig' && (
        <GuardianConfig props={{ sx: { mt: 2 } }} />
      )}
      {deployType == 'deployed' && configType == 'alreadyConfig' && (
        <GuardianDashboard props={{ sx: { mt: 2 } }} />
      )}
    </Box>
  );
}
