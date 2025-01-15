import { CallMadeOutlined, DeleteOutlined } from '@mui/icons-material';
import { Box, BoxProps, Grid2, IconButton, Typography } from '@mui/material';
import { isAddress } from 'ethers';
import { useMemo, useState } from 'react';
import CopyIcon, { InfoIcon } from 'src/components/icons/copy-icon';
import ExploreIcon from 'src/components/icons/explore-icon';
import { CHAINS } from 'src/configs/network-config';
import { AccountType, StandardToken } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';
import { getTokenData } from 'src/redux-slices/token-slice';
import { toFixed } from 'src/services';
import HideTokenDialog from './hide-token-dialog';
import SendTokenDialog from './send-token-dialog';

interface Props extends BoxProps {
  type: AccountType;
  token: StandardToken & { balance: string };
}

export default function TokenRow({ type, token, ...props }: Props) {
  const [openSend, setOpenSend] = useState(false);
  const [openHide, setOpenHide] = useState(false);

  return (
    <Box {...props}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 3, xs: 4 }}>
          {isAddress(token.address) ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{token.symbol}</Typography>
              <CopyIcon copyText={token.address} iconProps={{ sx: { fontSize: '14px' } }} />
              <ExploreIcon hash={token.address} config={{ isShowText: false }} />
            </Box>
          ) : (
            <Typography>{token.symbol}</Typography>
          )}
        </Grid2>
        <Grid2 size={{ md: 3, xs: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{toFixed(token.balance, 6)}</Typography>
            <InfoIcon title={token.balance} />
          </Box>
        </Grid2>
        <Grid2 size={{ md: 3, xs: 4 }}>
          <IconButton onClick={() => setOpenSend(true)}>
            <CallMadeOutlined sx={{ fontSize: '16px' }} />
          </IconButton>
          {isAddress(token.address) && (
            <IconButton onClick={() => setOpenHide(true)}>
              <DeleteOutlined sx={{ fontSize: '16px' }} />
            </IconButton>
          )}
        </Grid2>
      </Grid2>
      <SendTokenDialog
        open={openSend}
        type={type}
        token={token}
        onClose={() => setOpenSend(false)}
      />
      <HideTokenDialog open={openHide} token={token} onClose={() => setOpenHide(false)} />
    </Box>
  );
}

export function NativeTokenRow({ type, props }: { type: AccountType; props?: BoxProps }) {
  const { chainId } = useAppSelector((state) => state.config);
  const { balance } = useAppSelector((state) => getTokenData(state.token, type));

  const token = useMemo<(StandardToken & { balance: string }) | undefined>(() => {
    if (chainId > 0) {
      const chainConfig = CHAINS[chainId];
      const nativeToken = chainConfig.nativeCurrency;
      return {
        address: '',
        symbol: nativeToken.symbol,
        decimal: nativeToken.decimals,
        image: chainConfig.image,
        balance,
      };
    }
  }, [chainId, balance]);

  return token ? <TokenRow type={type} token={token} {...props} /> : <></>;
}
