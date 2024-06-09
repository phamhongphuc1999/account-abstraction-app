import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from 'src/components/scroll-to-top';
import LayoutWrapper, { SimpleLayoutWrapper } from 'src/components/wrapper/layout-wrapper';
import ThemeWrapper from 'src/components/wrapper/theme-wrapper';
import { LS } from 'src/configs/constance';
import { ThemeMode, WalletType } from 'src/global';
import LocalStorage from 'src/local-storage-connection/local-storage';
import LocalStorageProvider from 'src/local-storage-connection/local-storage-context';
import { initLocalStorage } from 'src/redux-slices/config-slice';
import store, { useAppDispatch } from 'src/redux-slices/store';
import WalletConnection from 'src/wallet-connection';

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

function RemainApp() {
  return (
    <LocalStorageProvider>
      <WalletConnection>
        <ThemeWrapper>
          <LayoutWrapper>
            <ToastContainer
              autoClose={4000}
              theme="dark"
              hideProgressBar={false}
              position="top-center"
            />
            <Outlet />
            <CommonAppEffect />
            <ScrollToTop />
          </LayoutWrapper>
        </ThemeWrapper>
      </WalletConnection>
    </LocalStorageProvider>
  );
}

function SimpleRemainApp() {
  return (
    <LocalStorageProvider>
      <ThemeWrapper>
        <SimpleLayoutWrapper>
          <ToastContainer
            autoClose={4000}
            theme="dark"
            hideProgressBar={false}
            position="top-center"
          />
          <Outlet />
          <CommonAppEffect />
          <ScrollToTop />
        </SimpleLayoutWrapper>
      </ThemeWrapper>
    </LocalStorageProvider>
  );
}

interface Props {
  mode: 'normal' | 'simple';
}

export default function ProviderApp({ mode }: Props) {
  return (
    <Provider store={store}>{mode == 'normal' ? <RemainApp /> : <SimpleRemainApp />}</Provider>
  );
}
