import { TextField, Typography } from '@mui/material';
import { Interface, ethers, isAddress } from 'ethers';
import { useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { AccountAbi__factory, BEP20Abi__factory } from 'src/contracts/typechain';
import { StandardToken } from 'src/global';
import useRecoverTokens from 'src/hooks/use-recover-tokens';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/hook';
import { formatAddress } from 'src/services';

interface Props {
  open: boolean;
  token: StandardToken & { balance: string };
  onClose: () => void;
}

export default function SendTokenDialog({ open, token, onClose }: Props) {
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const { sendEntryPoint } = useSendUserOp();
  const { balance } = useAppSelector((state) => state.token);
  const { fetchNativeBalance, fetchNormalBalance } = useRecoverTokens();

  function onAmountChange(value: string) {
    setAmount(value);
  }

  function onToChange(value: string) {
    setTo(value);
  }

  function onMax() {
    if (!isAddress(token.address)) setAmount(balance);
    else setAmount(token.balance);
  }

  async function nativeSubmit() {
    const accountInter = new Interface(AccountAbi__factory.abi);
    const callData = accountInter.encodeFunctionData('execute', [
      to,
      ethers.parseEther(amount),
      '0x00',
    ]);
    const isCheck = await sendEntryPoint(callData);
    if (isCheck) await fetchNativeBalance();
  }

  async function normalSubmit() {
    const accountInter = new Interface(AccountAbi__factory.abi);
    const bep20Inter = new Interface(BEP20Abi__factory.abi);
    let callData = bep20Inter.encodeFunctionData('transfer', [to, ethers.parseEther(amount)]);
    callData = accountInter.encodeFunctionData('execute', [token.address, 0, callData]);
    const isCheck = await sendEntryPoint(callData);
    if (isCheck) await fetchNormalBalance(token);
  }

  async function onSubmit() {
    if (!isAddress(token.address)) await nativeSubmit();
    else await normalSubmit();
  }

  return (
    <BaseDialog open={open} onClose={onClose} title={`Send ${token.symbol.toUpperCase()}`}>
      <BaseForm events={{ onExecute: onSubmit }}>
        <TitleItem
          titleWidth="65px"
          title="Token"
          component={
            <TextField
              fullWidth
              InputProps={{ readOnly: true }}
              value={isAddress(token.address) ? formatAddress(token.address, 6) : 'Native Token'}
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
              InputProps={{
                endAdornment: (
                  <Typography color="primary.main" sx={{ cursor: 'pointer' }} onClick={onMax}>
                    Max
                  </Typography>
                ),
              }}
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
    </BaseDialog>
  );
}
