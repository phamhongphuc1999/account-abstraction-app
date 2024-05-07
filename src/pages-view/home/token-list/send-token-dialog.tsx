import { TextField } from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { ActionToken } from 'src/global';
import { formatAddress } from 'src/services';

interface Props {
  open: boolean;
  token: ActionToken & { balance: string };
  onClose: () => void;
}

export default function SendTokenDialog({ open, token, onClose }: Props) {
  const [amount, setAmount] = useState('0');

  function onAmountChange(value: string) {
    setAmount(value);
  }

  async function nativeSubmit() {
    //
  }

  async function onSubmit() {
    if (!isAddress(token.address)) await nativeSubmit();
  }

  return (
    <BaseAccountDialog open={open} onClose={onClose} title="Send Token">
      <BaseForm events={{ onExecute: onSubmit }}>
        <TitleItem
          titleWidth="65px"
          title="Token"
          component={
            <TextField
              fullWidth
              InputProps={{ readOnly: true }}
              value={isAddress(token.address) ? formatAddress(token.address) : 'Native Token'}
            />
          }
        />
        <TitleItem
          titleWidth="65px"
          title="Amount"
          component={
            <TextField
              fullWidth
              type="float"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
            />
          }
          props={{ sx: { mt: 1.5 } }}
        />
      </BaseForm>
    </BaseAccountDialog>
  );
}
