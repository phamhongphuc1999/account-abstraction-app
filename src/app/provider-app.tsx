import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from 'src/components/scroll-to-top';
import LayoutWrapper from 'src/components/wrapper/layout-wrapper';
import ThemeWrapper from 'src/components/wrapper/theme-wrapper';
import store from 'src/redux-slices/store';
import WalletConnection from 'src/wallet-connection';

function RemainApp() {
  return (
    <WalletConnection>
      <ThemeWrapper>
        <LayoutWrapper>
          <ToastContainer
            autoClose={4000}
            theme="light"
            hideProgressBar={false}
            position="top-center"
          />
          <Outlet />
          <ScrollToTop />
        </LayoutWrapper>
      </ThemeWrapper>
    </WalletConnection>
  );
}

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <RemainApp />
    </Provider>
  );
}
