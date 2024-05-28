import { Box, Container, useTheme } from '@mui/material';
import ConnectionButton from 'src/components/button/connection-button';
import NetworkButton from 'src/components/button/network-button';
import ThemeButton from 'src/components/button/theme-button';
import { getColor } from 'src/services';

export default function Header() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'sticky',
        backgroundColor: getColor(theme.palette.mode, '#021C39', '#ffffff'),
      }}
    >
      <Container
        sx={{ height: 65, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box>
          <NetworkButton props={{ sx: { marginRight: '0.5rem' } }} />
          <ConnectionButton />
        </Box>
        <ThemeButton />
      </Container>
    </Box>
  );
}
