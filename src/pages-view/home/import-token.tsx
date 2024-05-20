import AddIcon from '@mui/icons-material/Add';
import { Box, BoxProps, TextField, Typography } from '@mui/material';
import { isAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { Bep20Contract } from 'src/contracts/bep20-contract';
import { useAppSelector } from 'src/redux-slices/hook';
import { getDecimalAmount } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  props?: BoxProps;
}

export default function ImportToken({ props }: Props) {
  const [open, setOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [decimal, setDecimal] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState('0');
  const { accountAddress } = useAppSelector((state) => state.user);
  const { reader } = usRpcProviderContext();

  const _fetch = useCallback(async () => {
    if (isAddress(tokenAddress) && reader) {
      const bep20Contract = new Bep20Contract(reader, tokenAddress);
      const _decimal = await bep20Contract.fn.decimals();
      const _symbol = await bep20Contract.fn.symbol();
      const intDecimal = parseInt(_decimal.toString());
      setDecimal(intDecimal);
      setSymbol(_symbol);
      if (isAddress(accountAddress)) {
        const _balance = await bep20Contract.fn.balanceOf(accountAddress);
        setBalance(getDecimalAmount(_balance.toString(), intDecimal).toFixed());
      }
    }
  }, [tokenAddress, reader, accountAddress]);

  useEffect(() => {
    _fetch();
  }, [_fetch]);

  async function onImportToken() {
    //
  }

  return (
    <Box {...props}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => setOpen(true)}>
        <AddIcon sx={{ fontSize: '14px' }} />
        <Typography
          sx={{
            fontSize: '16px',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Import new Token
        </Typography>
      </Box>
      <BaseDialog title="Import Token" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onImportToken }} metadata={{ executeTitle: 'Import' }}>
          <TitleItem
            titleWidth="80px"
            title="Token Address"
            component={
              <TextField
                fullWidth
                value={tokenAddress}
                onChange={(event) => setTokenAddress(event.target.value)}
              />
            }
          />
          <TitleItem
            titleWidth="80px"
            title="Decimal"
            component={<TextField fullWidth value={decimal} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="80px"
            title="Symbol"
            component={<TextField fullWidth value={symbol} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="80px"
            title="Balance"
            component={<TextField fullWidth value={balance} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
        </BaseForm>
      </BaseDialog>
    </Box>
  );
}
