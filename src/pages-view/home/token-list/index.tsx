import { Box, Grid, Typography } from '@mui/material';
import TokenRow, { NativeTokenRow } from './token-row';
import { useAppSelector } from 'src/redux-slices/hook';

export default function TokenList() {
  const { tokens } = useAppSelector((state) => state.token);

  return (
    <Box>
      <Typography variant="subtitle1">Tokens</Typography>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography>Token</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Balance</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Actions</Typography>
          </Grid>
        </Grid>
        <NativeTokenRow props={{ sx: { mt: 1 } }} />
        {Object.values(tokens).map((token) => {
          return <TokenRow key={token.address} token={token} props={{ sx: { mt: 1 } }} />;
        })}
      </Box>
    </Box>
  );
}
