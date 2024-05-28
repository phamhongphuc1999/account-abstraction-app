import { useEffect } from 'react';
import { LS } from 'src/configs/constance';
import { ThemeMode } from 'src/global';
import useFetchGuardianConfig from 'src/hooks/use-fetch-guardian-config';
import useRecoverTokens from 'src/hooks/use-recover-tokens';
import LocalStorage from 'src/local-storage-connection/local-storage';
import { initLocalStorage } from 'src/redux-slices/config-slice';
import { useAppDispatch } from 'src/redux-slices/store';

export default function AppEffect() {
  const dispatch = useAppDispatch();
  const { fetchGuardianAddress, fetchGuardianConfig } = useFetchGuardianConfig();
  const { recoverTokens, fetchNativeBalance } = useRecoverTokens();

  useEffect(() => {
    const _theme = LocalStorage.get(LS.THEME);
    if (_theme) dispatch(initLocalStorage({ themeMode: _theme as ThemeMode }));
  }, [dispatch]);

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
