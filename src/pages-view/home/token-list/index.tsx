import { Box, BoxProps, Grid2, Typography, useTheme } from '@mui/material';
import CopyIcon from 'src/components/icons/copy-icon';
import { AccountType } from 'src/global';
import useDeployedText from 'src/hooks/use-deployed-text';
import { useAppSelector } from 'src/redux-slices/store';
import { getTokenData } from 'src/redux-slices/token-slice';
import { formatAddress, getColor } from 'src/services';
import TokenRow, { NativeTokenRow } from './token-row';

interface Props extends BoxProps {
  type: AccountType;
}

function TokenAccountList({ type, ...props }: Props) {
  const { tokens } = useAppSelector((state) => getTokenData(state.token, type));
  const { ownerAddress, accountAddress } = useAppSelector((state) => state.user);
  const { deployText } = useDeployedText();

  const _address = type == 'owner' ? ownerAddress : accountAddress;

  return (
    <Box {...props}>
      <Typography variant="subtitle1">
        {type == 'accountAbstraction' ? `Account Tokens (${deployText})` : 'Owner Tokens'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>{formatAddress(_address, 3)}</Typography>
        <CopyIcon
          copyText={_address}
          iconProps={{ sx: { fontSize: '14px', color: 'primary.dark' } }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 3, xs: 4 }}>
            <Typography>Token</Typography>
          </Grid2>
          <Grid2 size={{ md: 3, xs: 4 }}>
            <Typography>Balance</Typography>
          </Grid2>
          <Grid2 size={{ md: 3, xs: 4 }}>
            <Typography>Actions</Typography>
          </Grid2>
        </Grid2>
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
