import { Typography } from '@mui/material';
import GuardianConfig from 'src/pages-view/guardian-manager/guardian-config';
import GuardianDashboard from 'src/pages-view/guardian-manager/guardian-dashboard';
import GuardianDeployment from 'src/pages-view/guardian-manager/guardian-deployment';
import { useAppSelector } from 'src/redux-slices/store';

export default function GuardianManager() {
  const { deployType, configType } = useAppSelector((state) => state.guardian);

  return (
    <>
      <Typography variant="subtitle1">Guardians Manager</Typography>
      {deployType == 'initial' && configType == 'initial' && (
        <Typography>
          Please deploy your account abstraction before trying guardian feature
        </Typography>
      )}
      {deployType == 'notDeploy' && <GuardianDeployment props={{ sx: { mt: 2 } }} />}
      {deployType == 'deployed' && configType == 'notConfig' && (
        <GuardianConfig props={{ sx: { mt: 2 } }} />
      )}
      {deployType == 'deployed' && configType == 'alreadyConfig' && (
        <GuardianDashboard props={{ sx: { mt: 2 } }} />
      )}
    </>
  );
}
