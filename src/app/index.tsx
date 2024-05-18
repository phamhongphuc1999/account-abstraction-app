import { useRoutes } from 'react-router-dom';
import Guardian from 'src/pages/guardian';
import Recovery from 'src/pages/recovery';
import Home from '../pages/home';
import ProviderApp from './provider-app';

export default function App() {
  return useRoutes([
    { path: '/', element: <ProviderApp />, children: [{ path: '/', element: <Home /> }] },
    {
      path: '/guardian',
      element: <ProviderApp />,
      children: [{ path: '', element: <Guardian /> }],
    },
    {
      path: '/recovery',
      element: <ProviderApp />,
      children: [
        { path: ':position', element: <Recovery /> },
        { path: '', element: <Recovery /> },
      ],
    },
  ]);
}
