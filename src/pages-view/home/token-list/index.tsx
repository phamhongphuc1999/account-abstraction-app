import { Box, BoxProps, Grid, Typography, useTheme } from '@mui/material';
import { AccountType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';
import { getTokenData } from 'src/redux-slices/token-slice';
import { getColor } from 'src/services';
import TokenRow, { NativeTokenRow } from './token-row';

interface Props extends BoxProps {
  type: AccountType;
}

function TokenAccountList({ type, ...props }: Props) {
  const { tokens } = useAppSelector((state) => getTokenData(state.token, type));

  return (
    <Box {...props}>
      <Typography variant="subtitle1">
        {type == 'accountAbstraction' ? 'Account Tokens' : 'Owner Tokens'}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={4}>
            <Typography>Token</Typography>
          </Grid>
          <Grid item md={3} xs={4}>
            <Typography>Balance</Typography>
          </Grid>
          <Grid item md={3} xs={4}>
            <Typography>Actions</Typography>
          </Grid>
        </Grid>
        <NativeTokenRow type={type} props={{ sx: { mt: 1 } }} />
        {Object.values(tokens).map((token) => {
          return <TokenRow key={token.address} type={type} token={token} sx={{ mt: 1 }} />;
        })}
      </Box>
    </Box>
  );
}

export default function TokenList() {
  const theme = useTheme();

  return (
    <>
      <TokenAccountList type="owner" />
      <TokenAccountList
        type="accountAbstraction"
        sx={{
          borderTop: `2px solid ${getColor(theme.palette.mode, '#132741', '#E5E5E5')}`,
          pt: 2,
        }}
      />
    </>
  );
}
