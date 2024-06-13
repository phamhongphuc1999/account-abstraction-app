import { Box, useTheme } from '@mui/material';
import ImportToken from 'src/pages-view/home/import-token';
import SignMessage from 'src/pages-view/home/sign-message';
import TokenList from 'src/pages-view/home/token-list';
import { getColor } from 'src/services';

export default function WagmiWalletHome() {
  const theme = useTheme();

  return (
    <>
      <TokenList />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mt: 1.5,
          pt: 1,
          borderTop: `2px solid ${getColor(theme.palette.mode, '#132741', '#E5E5E5')}`,
        }}
      >
        <ImportToken />
        <SignMessage />
      </Box>
    </>
  );
}
