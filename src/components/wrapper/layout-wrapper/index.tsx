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
      <Box sx={{ position: 'sticky' }}>
        <Container
          sx={{
            height: 65,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <NetworkButton props={{ sx: { marginRight: '0.5rem' } }} />
          <ConnectionButton />
        </Container>
      </Box>
      {children}
    </Box>
  );
}
