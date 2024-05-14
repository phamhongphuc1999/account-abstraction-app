import { Box, Typography } from '@mui/material';
import { ZeroAddress } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useAccountContract } from 'src/contracts/account-contract';
import GuardianDeployment from 'src/pages-view/guardian/guardian-deployment';
import { setGuardianAddress } from 'src/redux-slices/guardian-slice';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/hook';

export default function Guardian() {
  const accountContract = useAccountContract();
  const dispatch = useAppDispatch();
  const { deployType } = useAppSelector((state) => state.guardian);

  const _fetch = useCallback(async () => {
    if (accountContract) {
      const guardianAddress = await accountContract.fn.accountGuardian();
      if (guardianAddress != ZeroAddress)
        dispatch(setGuardianAddress({ address: guardianAddress, deployType: 'deployed' }));
      else dispatch(setGuardianAddress({ address: '', deployType: 'notDeploy' }));
    }
  }, [accountContract, dispatch]);

  useEffect(() => {
    _fetch();
  }, [_fetch]);

  return (
    <Box>
      <Typography variant="subtitle1">Guardians</Typography>
      {deployType && <GuardianDeployment props={{ sx: { mt: 2 } }} />}
    </Box>
  );
}
