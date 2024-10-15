import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from 'src/components/scroll-to-top';
import LayoutWrapper, { LoginLayoutWrapper } from 'src/components/wrapper/layout-wrapper';
import ThemeWrapper from 'src/components/wrapper/theme-wrapper';
import { LS } from 'src/configs/constance';
import { ThemeMode } from 'src/global';
import LocalStorage from 'src/local-storage-connection/local-storage';
import LocalStorageProvider from 'src/local-storage-connection/local-storage-context';
import { initLocalStorage } from 'src/redux-slices/config-slice';
import store, { useAppDispatch } from 'src/redux-slices/store';
import WalletConnection from 'src/wallet-connection';

function CommonAppEffect() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const _theme = LocalStorage.get(LS.THEME);
    if (_theme) dispatch(initLocalStorage({ themeMode: _theme as ThemeMode }));
  }, [dispatch]);

  return <></>;
}

function RegisterApp() {
  return (
    <LocalStorageProvider>
      <ThemeWrapper>
        <LoginLayoutWrapper>
          <ToastContainer
            autoClose={4000}
            theme="dark"
            hideProgressBar={false}
            position="top-center"
          />
          <Outlet />
          <CommonAppEffect />
          <ScrollToTop />
        </LoginLayoutWrapper>
      </ThemeWrapper>
    </LocalStorageProvider>
  );
}

function WalletApp() {
  return (
    <LocalStorageProvider>
      <WalletConnection>
        <ThemeWrapper>
          <LayoutWrapper>
            <CommonAppEffect />
            <ToastContainer
              autoClose={4000}
              theme="dark"
              hideProgressBar={false}
              position="top-center"
            />
            <Outlet />
            <ScrollToTop />
          </LayoutWrapper>
        </ThemeWrapper>
      </WalletConnection>
    </LocalStorageProvider>
  );
}

interface Props {
  mode: 'wallet' | 'register';
}

export default function ProviderApp({ mode }: Props) {
  return <Provider store={store}>{mode == 'wallet' ? <WalletApp /> : <RegisterApp />}</Provider>;
}
