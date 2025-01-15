import { Box, Container, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { getColor } from 'src/services';
import Header from './header';
import LoginHeader from './LoginHeader';
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
      <Header />
      <Box sx={{ background: getColor(theme.palette.mode, '#061526', '#F5F7FA') }}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: '100px',
          }}
        >
          <div style={{ minHeight: 'calc(100vh - 65px)' }}>{children}</div>
          <Box sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <Typography>My Account Abstraction App</Typography>
          </Box>
        </Container>
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
      </Box>
      <Container sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
        <Typography>My Account Abstraction App</Typography>
      </Container>
    </Box>
  );
}
