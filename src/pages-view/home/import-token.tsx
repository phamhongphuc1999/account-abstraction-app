import AddIcon from '@mui/icons-material/Add';
import { BoxProps } from '@mui/material';
import { isAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseActionForm from 'src/components/form/base-action-form';
import BaseForm from 'src/components/form/base-form';
import { TitleTextFieldItem } from 'src/components/title-item';
import Bep20Contract from 'src/contracts/bep20-contract';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/store';
import { upsertToken } from 'src/redux-slices/token-slice';
import { getDecimalAmount } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

export default function ImportToken(props: BoxProps) {
  const [open, setOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [decimal, setDecimal] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [ownerBalance, setOwnerBalance] = useState('0');
  const [accountBalance, setAccountBalance] = useState('0');
  const { accountAddress, ownerAddress } = useAppSelector((state) => state.user);
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
      if (isAddress(ownerAddress)) {
        const _balance = await bep20Contract.fn.balanceOf(ownerAddress);
        setOwnerBalance(getDecimalAmount(_balance.toString(), intDecimal).toFixed());
      }
      if (isAddress(accountAddress)) {
        const _balance = await bep20Contract.fn.balanceOf(accountAddress);
        setAccountBalance(getDecimalAmount(_balance.toString(), intDecimal).toFixed());
      }
    }
  }, [tokenAddress, reader, ownerAddress, accountAddress]);

  useEffect(() => {
    _fetch();
  }, [_fetch]);

  async function onImportToken() {
    dispatch(
      upsertToken({
        token: { address: tokenAddress, decimal, symbol },
        ownerBalance,
        accountBalance,
      })
    );
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
    setOwnerBalance('0');
    setAccountBalance('0');
  }

  return (
    <BaseActionForm
      IconComponent={AddIcon}
      title="Import new Token"
      boxIconProps={{ onClick: () => setOpen(true) }}
      {...props}
    >
      <BaseDialog title="Import Token" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onImportToken }} metadata={{ executeTitle: 'Import' }}>
          <TitleTextFieldItem
            titleWidth="80px"
            title="Token Address"
            textFieldProps={{
              fullWidth: true,
              value: tokenAddress,
              onChange: (event) => setTokenAddress(event.target.value),
            }}
            sx={{ mt: 1 }}
          />
          <TitleTextFieldItem
            titleWidth="80px"
            title="Decimal"
            textFieldProps={{
              fullWidth: true,
              value: decimal,
              slotProps: { input: { readOnly: true } },
            }}
            sx={{ mt: 1 }}
          />
          <TitleTextFieldItem
            titleWidth="80px"
            title="Symbol"
            textFieldProps={{
              fullWidth: true,
              value: symbol,
              slotProps: { input: { readOnly: true } },
            }}
            sx={{ mt: 1 }}
          />
          <TitleTextFieldItem
            titleWidth="80px"
            title="Owner Balance"
            textFieldProps={{
              fullWidth: true,
              value: ownerBalance,
              slotProps: { input: { readOnly: true } },
            }}
            sx={{ mt: 1 }}
          />
          <TitleTextFieldItem
            titleWidth="80px"
            title="Account Balance"
            textFieldProps={{
              fullWidth: true,
              value: accountBalance,
              slotProps: { input: { readOnly: true } },
            }}
            sx={{ mt: 1 }}
          />
        </BaseForm>
      </BaseDialog>
    </BaseActionForm>
  );
}
