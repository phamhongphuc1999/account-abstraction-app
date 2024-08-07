import { Box, Container, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { getColor } from 'src/services';
import Header, { LoginHeader } from './header';
import Sidebar from './sidebar';
import TransactionStatus from './transaction-status';
import useAppEffect from './use-app-effect';

interface Props {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: Props) {
  const theme = useTheme();
  useAppEffect();

  return (
    <Box>
      <Sidebar />
      <Box sx={{ [theme.breakpoints.up('sm')]: { ml: '130px' } }}>
        <Header />
        <Box sx={{ background: getColor(theme.palette.mode, '#061526', '#F5F7FA') }}>
          <Box sx={{ minHeight: 'calc(100vh - 65px)' }}>
            <Container sx={{ paddingTop: '1rem' }}>{children}</Container>
          </Box>
          <Container sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <Typography>My Account Abstraction App</Typography>
          </Container>
        </Box>
      </Box>
      <TransactionStatus />
    </Box>
  );
}

export function LoginLayoutWrapper({ children }: Props) {
  const theme = useTheme();

  return (
    <Box>
      <LoginHeader />
      <Box sx={{ background: getColor(theme.palette.mode, '#061526', '#F5F7FA') }}>
        <Box sx={{ minHeight: 'calc(100vh - 65px)' }}>
          <Container sx={{ paddingTop: '1rem' }}>{children}</Container>
        </Box>
        <Container sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
          <Typography>My Account Abstraction App</Typography>
        </Container>
      </Box>
    </Box>
  );
}
