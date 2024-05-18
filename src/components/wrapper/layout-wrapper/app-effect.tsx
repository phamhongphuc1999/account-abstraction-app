import { useEffect } from 'react';
import useFetchBalance from 'src/hooks/use-fetch-balance';
import useFetchGuardianConfig from 'src/hooks/use-fetch-guardian-config';

export default function AppEffect() {
  const { fetchNativeBalance } = useFetchBalance();
  const { fetchGuardianAddress, fetchGuardianConfig } = useFetchGuardianConfig();

  useEffect(() => {
    fetchNativeBalance();
  }, [fetchNativeBalance]);

  useEffect(() => {
    fetchGuardianAddress();
  }, [fetchGuardianAddress]);

  useEffect(() => {
    fetchGuardianConfig();
  }, [fetchGuardianConfig]);

  return <></>;
}
