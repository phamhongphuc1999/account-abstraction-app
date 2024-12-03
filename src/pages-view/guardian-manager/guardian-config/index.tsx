import { Box, BoxProps, TextField, Typography } from '@mui/material';
import { Interface } from 'ethers';
import { useState } from 'react';
import BaseForm from 'src/components/form/base-form';
import TitleItem from 'src/components/title-item';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import { GuardianHashListType } from 'src/global';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { generatePoseidonHash } from 'src/services/guardian-utils';
import GuardianAddresses from './guardian-addresses';

export default function GuardianConfig(props: BoxProps) {
  const { sendEntryPoint } = useSendUserOp();
  const [threshold, setThreshold] = useState('0');
  const [expirePeriod, setExpirePeriod] = useState('0');
  const [delay, setDelay] = useState('0');
  const [addresses, setAddresses] = useState<GuardianHashListType>({});
  const { guardianAddress } = useAppSelector((state) => state.guardian);

  async function onAdd(address: string) {
    const _hash = await generatePoseidonHash(address, 'hex');
    setAddresses((preValue) => {
      return { ...preValue, [address]: { address, hash: _hash } };
    });
  }

  function onRemove(address: string) {
    setAddresses((preValue) => {
      const newValue = { ...preValue };
      delete newValue[address];
      return newValue;
    });
  }

  async function onConfigGuardian() {
    const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
    const accountInter = new Interface(AccountAbi__factory.abi);
    let callData = guardianInter.encodeFunctionData('setupGuardians', [
      Object.values(addresses).map((item) => item.hash),
      threshold,
      expirePeriod,
      delay,
    ]);
    callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, callData]);
    await sendEntryPoint(callData);
  }

  return (
    <Box {...props}>
      <Typography>Config your Guardian</Typography>
      <Box sx={{ mt: 2 }}>
        <BaseForm events={{ onExecute: onConfigGuardian }}>
          <TitleItem
            titleWidth="110px"
            title="Threshold"
            component={
              <TextField
                fullWidth
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
              />
            }
          />
          <TitleItem
            titleWidth="110px"
            title="Expire Period"
            component={
              <TextField
                fullWidth
                value={expirePeriod}
                onChange={(event) => setExpirePeriod(event.target.value)}
              />
            }
            sx={{ mt: 2 }}
          />
          <TitleItem
            titleWidth="110px"
            title="delay"
            component={
              <TextField
                fullWidth
                value={delay}
                onChange={(event) => setDelay(event.target.value)}
              />
            }
            sx={{ mt: 2 }}
          />
          <Box sx={{ borderTop: '1px solid #ffffff', mt: 1 }} />
          <GuardianAddresses value={addresses} events={{ onAdd, onRemove }} />
        </BaseForm>
      </Box>
    </Box>
  );
}
