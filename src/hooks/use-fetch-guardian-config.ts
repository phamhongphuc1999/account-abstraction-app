import { ZeroAddress, isAddress } from 'ethers';
import { useCallback } from 'react';
import { useAccountContract } from 'src/contracts/account-contract';
import { useGuardianContract } from 'src/contracts/hash-guardian-contract';
import { setGuardianAddress, updateGuardianConfig } from 'src/redux-slices/guardian-slice';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/hook';

export default function useFetchGuardianConfig() {
  const accountContract = useAccountContract();
  const dispatch = useAppDispatch();
  const { guardianAddress, deployType, configType } = useAppSelector((state) => state.guardian);
  const guardianContract = useGuardianContract(guardianAddress);

  const _fetchGuardianAddress = useCallback(async () => {
    if (accountContract && deployType == 'initial') {
      const guardianAddress = await accountContract.fn.accountGuardian();
      if (guardianAddress != ZeroAddress)
        dispatch(setGuardianAddress({ guardianAddress, deployType: 'deployed' }));
      else dispatch(setGuardianAddress({ guardianAddress: '', deployType: 'notDeploy' }));
    }
  }, [accountContract, dispatch, deployType]);

  const _fetchGuardianConfig = useCallback(async () => {
    if (isAddress(guardianAddress) && guardianContract && configType == 'initial') {
      const threshold = await guardianContract.fn.threshold();
      const _threshold = parseInt(threshold.toString());
      if (_threshold == 0)
        dispatch(updateGuardianConfig({ threshold: _threshold, configType: 'notConfig' }));
      else {
        const guardianCount = await guardianContract.fn.guardianCount();
        const _guardianCount = parseInt(guardianCount.toString());
        const delay = await guardianContract.fn.getDelay();
        const ownerTransactionCount = await guardianContract.fn.getOwnerTransactionCount();
        const hashList: Array<string> = [];
        let counter = 0;
        while (counter < _guardianCount) {
          const _hash = await guardianContract.fn.guardians(counter);
          hashList.push(_hash.toString());
          counter++;
        }
        dispatch(
          updateGuardianConfig({
            threshold: _threshold,
            guardianCount: _guardianCount,
            delay: parseInt(delay.toString()),
            ownerTransactionCount: parseInt(ownerTransactionCount.toString()),
            hashList,
            configType: 'alreadyConfig',
          })
        );
      }
    }
  }, [guardianAddress, guardianContract, dispatch, configType]);

  return { fetchGuardianAddress: _fetchGuardianAddress, fetchGuardianConfig: _fetchGuardianConfig };
}
