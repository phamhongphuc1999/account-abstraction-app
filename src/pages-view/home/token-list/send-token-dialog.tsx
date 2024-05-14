import { TextField } from '@mui/material';
import { Interface, ethers, isAddress } from 'ethers';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { AccountAbi__factory } from 'src/contracts/typechain';
import { ActionToken } from 'src/global';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { formatAddress } from 'src/services';

interface Props {
  open: boolean;
  token: ActionToken & { balance: string };
  onClose: () => void;
}

export default function SendTokenDialog({ open, token, onClose }: Props) {
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const { sendEntryPoint } = useSendUserOp();

  function onAmountChange(value: string) {
    setAmount(value);
  }

  function onToChange(value: string) {
    setTo(value);
  }

  async function nativeSubmit() {
    const accountInter = new Interface(AccountAbi__factory.abi);
    const callData = accountInter.encodeFunctionData('execute', [
      to,
      ethers.parseEther(amount),
      '0x00',
    ]);
    await sendEntryPoint(callData);
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
        <TitleItem
          titleWidth="65px"
          title="To"
          component={
            <TextField
              fullWidth
              type="float"
              value={to}
              onChange={(event) => onToChange(event.target.value)}
            />
          }
          props={{ sx: { mt: 1.5 } }}
        />
      </BaseForm>
    </BaseAccountDialog>
  );
}
