import { useEffect } from 'react';
import useFetchGuardianConfig from 'src/hooks/use-fetch-guardian-config';
import useRecoverTokens from 'src/hooks/use-recover-tokens';

export default function AppEffect() {
  const { fetchGuardianAddress, fetchGuardianConfig } = useFetchGuardianConfig();
  const { recoverTokens, fetchNativeBalance } = useRecoverTokens();

  useEffect(() => {
    fetchNativeBalance();
  }, [fetchNativeBalance]);

  useEffect(() => {
    fetchGuardianAddress();
  }, [fetchGuardianAddress]);

  useEffect(() => {
    fetchGuardianConfig();
  }, [fetchGuardianConfig]);

  useEffect(() => {
    recoverTokens();
  }, [recoverTokens]);

  return <></>;
}
