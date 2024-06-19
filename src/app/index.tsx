import { Navigate, useRoutes } from 'react-router-dom';
import BabyjubRegister from 'src/pages/babyjub-register';
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
      path: '/babyjub-register',
      element: <ProviderApp mode="register" />,
      children: [{ path: '', element: <BabyjubRegister /> }],
    },
    {
      path: '/curve-page',
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
