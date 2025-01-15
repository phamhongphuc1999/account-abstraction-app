import { Box, Container, useTheme } from '@mui/material';
import ThemeButton from 'src/components/button/theme-button';
import { getColor } from 'src/services';

export default function LoginHeader() {
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
        <ThemeButton />
      </Container>
    </Box>
  );
}
