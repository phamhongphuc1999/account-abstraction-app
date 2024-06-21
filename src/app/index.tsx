import { Navigate, useRoutes } from 'react-router-dom';
import BJJImport from 'src/pages/bjj-import';
import BJJRegister from 'src/pages/bjj-register';
import CurvePage from 'src/pages/curve-page';
import CurveRegister from 'src/pages/curve-register';
import GuardianAccount from 'src/pages/guardian-account';
import GuardianManager from 'src/pages/guardian-manager';
import Home from '../pages/home';
import ProviderApp from './provider-app';

export default function App() {
  return useRoutes([
    {
      path: '/',
      element: <ProviderApp mode="wallet" />,
      children: [{ path: '', element: <Home /> }],
    },
    {
      path: '/curve-register',
      element: <ProviderApp mode="register" />,
      children: [{ path: '', element: <CurveRegister /> }],
    },
    {
      path: '/baby-jub',
      element: <ProviderApp mode="register" />,
      children: [
        { path: 'register', element: <BJJRegister /> },
        { path: 'import', element: <BJJImport /> },
      ],
    },
    {
      path: '/curve-page',
      id: 'curve',
      element: <ProviderApp mode="wallet" />,
      children: [
        { path: ':schema', element: <CurvePage /> },
        { path: '', element: <Navigate to="/curve-page/ed25519" /> },
      ],
    },
    {
      path: '/guardian',
      element: <ProviderApp mode="wallet" />,
      children: [
        { path: 'manager', element: <GuardianManager /> },
        { path: 'account', element: <GuardianAccount /> },
      ],
    },
  ]);
}
