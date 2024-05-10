import { TextField } from '@mui/material';
import { Interface, ethers, isAddress } from 'ethers';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { SIMPLE_SALT } from 'src/configs/constance';
import { AccountAbi__factory } from 'src/contracts/typechain';
import { ActionToken } from 'src/global';
import { useAppSelector } from 'src/redux-slices/hook';
import { formatAddress, getAccountInitCode, isDeploy, toBeHexlify } from 'src/services';
import StaticQuery from 'src/services/static-query';
import UserOperationService from 'src/user-operation-service';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  open: boolean;
  token: ActionToken & { balance: string };
  onClose: () => void;
}

export default function SendTokenDialog({ open, token, onClose }: Props) {
  const [amount, setAmount] = useState('0');
  const [to, setTo] = useState('');
  const { chainId } = useAppSelector((state) => state.config);
  const { ownerAddress, accountAddress } = useAppSelector((state) => state.user);
  const { ENTRY_POINT_ADDRESS, ACCOUNT_FACTORY_ADDRESS } = StaticQuery.getAddresses(chainId);
  const { reader, signer, bundler } = usRpcProviderContext();

  function onAmountChange(value: string) {
    setAmount(value);
  }

  function onToChange(value: string) {
    setTo(value);
  }

  async function nativeSubmit() {
    if (
      isAddress(ENTRY_POINT_ADDRESS) &&
      isAddress(accountAddress) &&
      isAddress(ownerAddress) &&
      reader &&
      signer &&
      bundler
    ) {
      const accountInter = new Interface(AccountAbi__factory.abi);
      const callData = accountInter.encodeFunctionData('execute', [
        to,
        ethers.parseEther(amount),
        '0x00',
      ]);
      const _isDeploy = await isDeploy(accountAddress, reader);
      const _code = _isDeploy
        ? undefined
        : await getAccountInitCode(ACCOUNT_FACTORY_ADDRESS, ownerAddress, SIMPLE_SALT);
      const nonce = await signer.getNonce();
      const op = await UserOperationService.fillSign(
        chainId,
        ENTRY_POINT_ADDRESS,
        reader,
        { sender: ownerAddress, nonce: toBeHexlify(nonce), callData, initCode: _code },
        signer
      );
      console.error('🚀 ~ nativeSubmit ~ op:', op);
      await bundler.sendUserOperation(op, ENTRY_POINT_ADDRESS);
    }
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
