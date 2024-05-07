import { useRoutes } from 'react-router-dom';
import Home from '../pages/home';
import ProviderApp from './provider-app';

export default function App() {
  return useRoutes([
    {
      path: '/',
      element: <ProviderApp />,
      children: [{ path: '/', element: <Home /> }],
    },
  ]);
}
