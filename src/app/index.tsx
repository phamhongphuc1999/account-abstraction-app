import { useRoutes } from 'react-router-dom';
import Guardian from 'src/pages/guardian';
import HashSystemRegister from 'src/pages/hash-system-register';
import Login from 'src/pages/login';
import Recovery from 'src/pages/recovery';
import Home from '../pages/home';
import ProviderApp from './provider-app';

export default function App() {
  return useRoutes([
    {
      path: '/',
      element: <ProviderApp mode="normal" />,
      children: [
        { path: '/metamask', element: <Home /> },
        { path: '/hash-system-wallet', element: <Home /> },
      ],
    },
    {
      path: '/guardian',
      element: <ProviderApp mode="normal" />,
      children: [{ path: '', element: <Guardian /> }],
    },
    {
      path: '/recovery',
      element: <ProviderApp mode="normal" />,
      children: [
        { path: ':position', element: <Recovery /> },
        { path: '', element: <Recovery /> },
      ],
    },
    {
      path: '/login',
      element: <ProviderApp mode="simple" />,
      children: [{ path: '', element: <Login /> }],
    },
    {
      path: '/hash-system-register',
      element: <ProviderApp mode="simple" />,
      children: [{ path: '', element: <HashSystemRegister /> }],
    },
  ]);
}
