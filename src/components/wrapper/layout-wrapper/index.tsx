import { Box, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';
import ConnectionButton from 'src/components/button/connection-button';
import NetworkButton from 'src/components/button/network-button';
import AppEffect from './app-effect';
import Sidebar from './sidebar';

interface Props {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: Props) {
  return (
    <Box>
      <AppEffect />
      <Sidebar />
      <Box sx={{ ml: '130px' }}>
        <Box sx={{ position: 'sticky', backgroundColor: '#021C39' }}>
          <Container sx={{ height: 65, display: 'flex', alignItems: 'center' }}>
            <NetworkButton props={{ sx: { marginRight: '0.5rem' } }} />
            <ConnectionButton />
          </Container>
        </Box>
        <Box sx={{ background: '#061526' }}>
          <Box sx={{ height: 'calc(100vh - 65px)' }}>
            <Container sx={{ paddingTop: '1rem' }}>{children}</Container>
          </Box>
          <Container sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            <Typography>My Account Abstraction App</Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
