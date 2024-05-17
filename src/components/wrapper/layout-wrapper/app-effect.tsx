import { useEffect } from 'react';
import useFetchBalance from 'src/hooks/use-fetch-balance';

export default function AppEffect() {
  const { fetchNativeBalance } = useFetchBalance();

  useEffect(() => {
    fetchNativeBalance();
  }, [fetchNativeBalance]);

  return <></>;
}
