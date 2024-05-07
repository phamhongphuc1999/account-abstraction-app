import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import { Box, BoxProps, Grid, IconButton, Typography } from '@mui/material';
import { isAddress } from 'ethers';
import { useMemo, useState } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import ExploreIcon from 'src/components/icons/explore-icon';
import { TokenImage } from 'src/components/token-image';
import { CHAINS } from 'src/configs/network-config';
import { ActionToken } from 'src/global';
import { useAppSelector } from 'src/redux-slices/hook';
import SendTokenDialog from './send-token-dialog';

interface Props {
  token: ActionToken & { balance: string };
  props?: BoxProps;
}

export default function TokenRow({ token, props }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Box {...props}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TokenImage image={token.image} symbol={token.symbol} />
            {isAddress(token.address) && (
              <>
                <CopyIcon copyText={token.address} />
                <ExploreIcon hash={token.address} />
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Typography>{token.balance}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton onClick={() => setOpen(true)}>
            <CallMadeOutlinedIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Grid>
      </Grid>
      <SendTokenDialog open={open} token={token} onClose={() => setOpen(false)} />
    </Box>
  );
}

export function NativeTokenRow({ props }: { props?: BoxProps }) {
  const { chainId } = useAppSelector((state) => state.config);
  const { balance } = useAppSelector((state) => state.token);

  const token = useMemo<(ActionToken & { balance: string }) | undefined>(() => {
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

  return token ? <TokenRow token={token} props={props} /> : <></>;
}
