import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from 'src/components/scroll-to-top';
import {
  HashSystemLayoutWrapper,
  LoginLayoutWrapper,
  WagmiLayoutWrapper,
} from 'src/components/wrapper/layout-wrapper';
import ThemeWrapper from 'src/components/wrapper/theme-wrapper';
import { LS } from 'src/configs/constance';
import { ThemeMode, WalletType } from 'src/global';
import LocalStorage from 'src/local-storage-connection/local-storage';
import LocalStorageProvider from 'src/local-storage-connection/local-storage-context';
import { initLocalStorage } from 'src/redux-slices/config-slice';
import store, { useAppDispatch } from 'src/redux-slices/store';
import WalletConnection from 'src/wallet-connection';
import HashSystemConnection from 'src/wallet-connection/hash-system-wallet';

function CommonAppEffect() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const _theme = LocalStorage.get(LS.THEME);
    const _walletType = LocalStorage.get(LS.WALLET_TYPE) ?? undefined;
    if (_theme)
      dispatch(
        initLocalStorage({ themeMode: _theme as ThemeMode, walletType: _walletType as WalletType })
      );
  }, [dispatch]);

  return <></>;
}

function LoginApp() {
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

function WagmiWalletApp() {
  return (
    <LocalStorageProvider>
      <WalletConnection>
        <ThemeWrapper>
          <WagmiLayoutWrapper>
            <ToastContainer
              autoClose={4000}
              theme="dark"
              hideProgressBar={false}
              position="top-center"
            />
            <Outlet />
            <CommonAppEffect />
            <ScrollToTop />
          </WagmiLayoutWrapper>
        </ThemeWrapper>
      </WalletConnection>
    </LocalStorageProvider>
  );
}

function HashSystemApp() {
  return (
    <LocalStorageProvider>
      <HashSystemConnection>
        <ThemeWrapper>
          <HashSystemLayoutWrapper>
            <ToastContainer
              autoClose={4000}
              theme="dark"
              hideProgressBar={false}
              position="top-center"
            />
            <Outlet />
            <CommonAppEffect />
            <ScrollToTop />
          </HashSystemLayoutWrapper>
        </ThemeWrapper>
      </HashSystemConnection>
    </LocalStorageProvider>
  );
}

interface Props {
  mode: 'wagmi-wallet' | 'login' | 'hash-system-wallet';
}

export default function ProviderApp({ mode }: Props) {
  return (
    <Provider store={store}>
      {mode == 'login' && <LoginApp />}
      {mode == 'wagmi-wallet' && <WagmiWalletApp />}
      {mode == 'hash-system-wallet' && <HashSystemApp />}
    </Provider>
  );
}
