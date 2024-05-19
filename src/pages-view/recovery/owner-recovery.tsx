/* eslint-disable quotes */
import { Box, TextField, Typography } from '@mui/material';
import { Interface, ZeroAddress, isAddress } from 'ethers';
import { useState } from 'react';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { AccountAbi__factory, HashGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/hook';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  enoughConfirm: boolean;
  tempNewOwner: string;
}

export default function OwnerRecovery({ enoughConfirm, tempNewOwner }: Props) {
  const { ownerAddress } = useAppSelector((state) => state.user);
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const [newOwner, setNewOwner] = useState('');
  const { reader } = usRpcProviderContext();
  const { sendEntryPoint } = useSendUserOp();

  async function submitNewOwner() {
    if (reader && isAddress(newOwner) && newOwner.toLowerCase() != ownerAddress) {
      const guardianInter = new Interface(HashGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('submitNewOwner', [newOwner]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    }
  }

  return (
    <>
      {isAddress(tempNewOwner) && tempNewOwner != ZeroAddress ? (
        <Box sx={{ width: '70%', mt: 2 }}>
          <Typography sx={{ mt: 1 }}>
            {enoughConfirm
              ? 'You have enough confirm from your guardians'
              : "You don't have enough confirm from your guardians"}
          </Typography>
          <TitleItem
            titleWidth="100px"
            title="New Owner"
            component={<TextField fullWidth value={tempNewOwner} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
        </Box>
      ) : (
        <Box sx={{ width: '70%', borderTop: '1px solid #ffffff', mt: 2, pt: 2 }}>
          <BaseForm events={{ onExecute: submitNewOwner }}>
            <TitleItem
              titleWidth="100px"
              title="New Owner"
              component={
                <TextField
                  fullWidth
                  value={newOwner}
                  onChange={(event) => setNewOwner(event.target.value.toLowerCase())}
                />
              }
            />
          </BaseForm>
        </Box>
      )}
    </>
  );
}
