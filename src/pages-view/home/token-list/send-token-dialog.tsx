import { TextField, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Interface, ethers, isAddress } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/form/base-form';
import TitleItem from 'src/components/title-item';
import { TX_SEND_FEE } from 'src/configs/constance';
import Bep20Contract from 'src/contracts/bep20-contract';
import { AccountAbi__factory, BEP20Abi__factory } from 'src/contracts/typechain';
import { AccountType, StandardToken } from 'src/global';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { getTokenData } from 'src/redux-slices/token-slice';
import { formatAddress } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  open: boolean;
  type: AccountType;
  token: StandardToken & { balance: string };
  onClose: () => void;
}

export default function SendTokenDialog({ open, type, token, onClose }: Props) {
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const { sendEntryPoint } = useSendUserOp();
  const { balance } = useAppSelector((state) => getTokenData(state.token, type));
  const { signer } = usRpcProviderContext();

  function onAmountChange(value: string) {
    setAmount(value);
  }

  function onToChange(value: string) {
    setTo(value);
  }

  function onMax() {
    if (!isAddress(token.address)) setAmount(BigNumber(balance).minus(TX_SEND_FEE).toFixed());
    else setAmount(token.balance);
  }

  async function nativeSubmit() {
    try {
      if (type == 'accountAbstraction') {
        const accountInter = new Interface(AccountAbi__factory.abi);
        const callData = accountInter.encodeFunctionData('execute', [
          to,
          ethers.parseEther(amount),
          '0x00',
        ]);
        await sendEntryPoint(callData);
      } else if (signer) {
        signer.sendTransaction({ to, value: ethers.parseEther(amount) });
      }
    } catch (error) {
      toast.error(String(error));
    }
  }

  async function normalSubmit() {
    try {
      if (type == 'accountAbstraction') {
        const accountInter = new Interface(AccountAbi__factory.abi);
        const bep20Inter = new Interface(BEP20Abi__factory.abi);
        let callData = bep20Inter.encodeFunctionData('transfer', [to, ethers.parseEther(amount)]);
        callData = accountInter.encodeFunctionData('execute', [token.address, 0, callData]);
        await sendEntryPoint(callData);
      } else if (signer) {
        const bep20Contract = new Bep20Contract(signer, token.address);
        const tx = await bep20Contract.fn.transfer(to, ethers.parseEther(amount));
        await tx.wait();
      }
    } catch (error) {
      toast.error(String(error));
    }
  }

  async function onSubmit() {
    if (!isAddress(token.address)) await nativeSubmit();
    else await normalSubmit();
  }

  return (
    <BaseDialog open={open} onClose={onClose} title={`Send ${token.symbol.toUpperCase()}`}>
      <BaseForm events={{ onExecute: onSubmit }} metadata={{ executeTitle: 'Send' }}>
        <TitleItem
          titleWidth="65px"
          title="Token"
          component={
            <TextField
              fullWidth
              slotProps={{ input: { readOnly: true } }}
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
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography color="primary.main" sx={{ cursor: 'pointer' }} onClick={onMax}>
                      Max
                    </Typography>
                  ),
                },
              }}
            />
          }
          sx={{ mt: 1.5 }}
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
          sx={{ mt: 1.5 }}
        />
      </BaseForm>
    </BaseDialog>
  );
}
