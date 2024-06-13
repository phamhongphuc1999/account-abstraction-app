import { useRoutes } from 'react-router-dom';
import Guardian from 'src/pages/guardian';
import HashSystemRegister from 'src/pages/hash-system-register';
import HashSystemHome from 'src/pages/home/hash-system-home';
import Login from 'src/pages/login';
import Recovery from 'src/pages/recovery';
import WagmiWalletHome from '../pages/home/wagmi-wallet-home';
import ProviderApp from './provider-app';

export default function App() {
  return useRoutes([
    {
      path: '/',
      element: <ProviderApp mode="wagmi-wallet" />,
      children: [{ path: '/wagmi-wallet', element: <WagmiWalletHome /> }],
    },
    {
      path: '/',
      element: <ProviderApp mode="hash-system-wallet" />,
      children: [{ path: '/hash-system', element: <HashSystemHome /> }],
    },
    {
      path: '/guardian',
      element: <ProviderApp mode="hash-system-wallet" />,
      children: [{ path: '', element: <Guardian /> }],
    },
    {
      path: '/recovery',
      element: <ProviderApp mode="hash-system-wallet" />,
      children: [
        { path: ':position', element: <Recovery /> },
        { path: '', element: <Recovery /> },
      ],
    },
    {
      path: '/login',
      element: <ProviderApp mode="login" />,
      children: [{ path: '', element: <Login /> }],
    },
    {
      path: '/hash-system-register',
      element: <ProviderApp mode="login" />,
      children: [{ path: '', element: <HashSystemRegister /> }],
    },
  ]);
}
