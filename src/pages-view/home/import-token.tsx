import AddIcon from '@mui/icons-material/Add';
import { BoxProps, TextField } from '@mui/material';
import { isAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseActionForm from 'src/components/form/base-action-form';
import BaseForm from 'src/components/form/base-form';
import TitleItem from 'src/components/title-item';
import Bep20Contract from 'src/contracts/bep20-contract';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/store';
import { upsertToken } from 'src/redux-slices/token-slice';
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
  const dispatch = useAppDispatch();
  const { indexedStorage } = useLocalStorageContext();

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
    dispatch(upsertToken({ address: tokenAddress, decimal, symbol, balance }));
    if (indexedStorage) {
      await indexedStorage.token.upsert(tokenAddress.toLowerCase(), {
        address: tokenAddress.toLowerCase(),
        decimal,
        symbol,
      });
    }
    setOpen(false);
    setTokenAddress('');
    setDecimal(0);
    setSymbol('');
    setBalance('0');
  }

  return (
    <BaseActionForm
      IconComponent={AddIcon}
      title="Import new Token"
      boxIconProps={{ onClick: () => setOpen(true) }}
      props={props}
    >
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
    </BaseActionForm>
  );
}
