import { Box, Grid, Typography } from '@mui/material';
import { NativeTokenRow } from './token-row';

export default function TokenList() {
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
      </Box>
    </Box>
  );
}
