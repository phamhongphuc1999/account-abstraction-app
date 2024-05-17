import { ZeroAddress, isAddress } from 'ethers';
import { useCallback } from 'react';
import { useAccountContract } from 'src/contracts/account-contract';
import { useGuardianContract } from 'src/contracts/hash-guardian-contract';
import { setGuardianAddress, updateGuardianConfig } from 'src/redux-slices/guardian-slice';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/hook';

export default function useFetchGuardianConfig() {
  const accountContract = useAccountContract();
  const dispatch = useAppDispatch();
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const guardianContract = useGuardianContract(guardianAddress);

  const _fetchGuardianAddress = useCallback(async () => {
    if (accountContract) {
      const guardianAddress = await accountContract.fn.accountGuardian();
      if (guardianAddress != ZeroAddress)
        dispatch(setGuardianAddress({ guardianAddress, deployType: 'notConfig' }));
      else dispatch(setGuardianAddress({ guardianAddress: '', deployType: 'notDeploy' }));
    }
  }, [accountContract, dispatch]);

  const _fetchGuardianConfig = useCallback(async () => {
    if (isAddress(guardianAddress) && guardianContract) {
      const threshold = await guardianContract.fn.threshold();
      const _threshold = parseInt(threshold.toString());
      if (_threshold == 0)
        dispatch(updateGuardianConfig({ threshold: _threshold, deployType: 'notConfig' }));
      else {
        const guardianCount = await guardianContract.fn.guardianCount();
        const delay = await guardianContract.fn.getDelay();
        const ownerTransactionCount = await guardianContract.fn.getOwnerTransactionCount();
        dispatch(
          updateGuardianConfig({
            threshold: _threshold,
            guardianCount: parseInt(guardianCount.toString()),
            delay: parseInt(delay.toString()),
            ownerTransactionCount: parseInt(ownerTransactionCount.toString()),
            deployType: 'deployed',
          })
        );
      }
    }
  }, [guardianAddress, guardianContract, dispatch]);

  return { fetchGuardianAddress: _fetchGuardianAddress, fetchGuardianConfig: _fetchGuardianConfig };
}
