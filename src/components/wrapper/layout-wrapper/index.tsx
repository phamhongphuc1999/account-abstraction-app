import { Box, Container, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { getColor } from 'src/services';
import AppEffect from './app-effect';
import Header from './header';
import LoginHeader from './header/login-header';
import Sidebar from './sidebar';
import TransactionStatus from './transaction-status';

interface Props {
  children: ReactNode;
}

export function WagmiLayoutWrapper({ children }: Props) {
  const theme = useTheme();

  return (
    <Box>
      <AppEffect />
      <Sidebar />
      <Box sx={{ [theme.breakpoints.up('sm')]: { ml: '130px' } }}>
        <Header mode="wagmi" />
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

export function HashSystemLayoutWrapper({ children }: Props) {
  const theme = useTheme();

  return (
    <Box>
      <Sidebar />
      <Box sx={{ [theme.breakpoints.up('sm')]: { ml: '130px' } }}>
        <Header mode="hash-system" />
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
