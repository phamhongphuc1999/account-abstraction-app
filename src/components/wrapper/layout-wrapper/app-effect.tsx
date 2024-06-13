import { useEffect } from 'react';
import useFetchGuardianConfig from 'src/hooks/use-fetch-guardian-config';
import useRecoverTokens from 'src/hooks/use-recover-tokens';
import { useAppSelector } from 'src/redux-slices/store';

export default function AppEffect() {
  const { fetchGuardianAddress, fetchGuardianConfig } = useFetchGuardianConfig();
  const { recoverTokens, fetchNativeBalance } = useRecoverTokens();
  const { accountAddress, ownerAddress } = useAppSelector((state) => state.user);

  useEffect(() => {
    fetchNativeBalance(accountAddress, 'accountAbstraction');
    fetchNativeBalance(ownerAddress, 'owner');
  }, [fetchNativeBalance, accountAddress, ownerAddress]);

  useEffect(() => {
    recoverTokens(accountAddress, 'accountAbstraction');
    recoverTokens(ownerAddress, 'owner');
  }, [recoverTokens, accountAddress, ownerAddress]);

  useEffect(() => {
    fetchGuardianAddress();
  }, [fetchGuardianAddress]);

  useEffect(() => {
    fetchGuardianConfig();
  }, [fetchGuardianConfig]);

  return <></>;
}
