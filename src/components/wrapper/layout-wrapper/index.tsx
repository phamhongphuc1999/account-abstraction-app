import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';
import ConnectionButton from 'src/components/button/connection-button';
import NetworkButton from 'src/components/button/network-button';

interface Props {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: Props) {
  return (
    <Box>
      <Box sx={{ position: 'sticky', backgroundColor: '#021C39' }}>
        <Container sx={{ height: 65, display: 'flex', alignItems: 'center' }}>
          <NetworkButton props={{ sx: { marginRight: '0.5rem' } }} />
          <ConnectionButton />
        </Container>
      </Box>
      <Container sx={{ paddingTop: '1rem', background: '#061526', height: 'calc(100vh - 65px)' }}>
        {children}
      </Container>
    </Box>
  );
}
