import { useCallback, useEffect, useState } from 'react';
import { useZKGuardianContract } from 'src/contracts/zk-guardian-contract';
import OwnerRecovery from './owner-recovery';

export default function SubmitNewOwner() {
  const [enoughConfirm, setEnoughConfirm] = useState(false);
  const [tempNewOwner, setTempNewOwner] = useState('');
  const guardianContract = useZKGuardianContract();

  const _fetchEnoughConfirm = useCallback(async () => {
    if (guardianContract) {
      const _isEnoughConfirm = await guardianContract.fn.isEnoughConfirm();
      setEnoughConfirm(_isEnoughConfirm);
      const _tempNewOwner = await guardianContract.fn._tempNewOwner();
      setTempNewOwner(_tempNewOwner);
    }
  }, [guardianContract]);

  useEffect(() => {
    _fetchEnoughConfirm();
  }, [_fetchEnoughConfirm]);

  return <OwnerRecovery enoughConfirm={enoughConfirm} tempNewOwner={tempNewOwner} />;
}
