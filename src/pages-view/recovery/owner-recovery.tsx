/* eslint-disable quotes */
import { Box, BoxProps, TextField, Typography } from '@mui/material';
import { Interface, ZeroAddress, isAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import BaseForm from 'src/components/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { useHashGuardianContract } from 'src/contracts/hash-guardian-contract';
import { AccountAbi__factory, HashGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';

interface Props {
  enoughConfirm: boolean;
  tempNewOwner: string;
  props?: BoxProps;
}

export default function OwnerRecovery({ enoughConfirm, tempNewOwner, props }: Props) {
  const { ownerAddress } = useAppSelector((state) => state.user);
  const { guardianAddress, config } = useAppSelector((state) => state.guardian);
  const { hashList } = config;
  const [newOwner, setNewOwner] = useState('');
  const [confirms, setConfirms] = useState<Array<{ hash: string; isConfirm: boolean }>>([]);
  const { sendEntryPoint } = useSendUserOp();
  const guardianContract = useHashGuardianContract();

  const _fetchConfirms = useCallback(async () => {
    if (guardianContract) {
      const result: Array<{ hash: string; isConfirm: boolean }> = [];
      for (const _hash of hashList) {
        const isConfirm = await guardianContract.fn.confirms(_hash);
        result.push({ hash: _hash, isConfirm });
      }
      setConfirms(result);
    }
  }, [guardianContract, hashList]);

  useEffect(() => {
    _fetchConfirms();
  }, [_fetchConfirms]);

  async function submitNewOwner() {
    if (isAddress(newOwner) && newOwner.toLowerCase() != ownerAddress) {
      const guardianInter = new Interface(HashGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('submitNewOwner', [newOwner]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    }
  }

  return (
    <Box {...props}>
      {isAddress(tempNewOwner) && tempNewOwner != ZeroAddress ? (
        <Box sx={{ width: '70%' }}>
          <Typography sx={{ mt: 1 }}>
            {enoughConfirm
              ? 'You have enough confirm from your guardians'
              : "You don't have enough confirm from your guardians"}
          </Typography>
          <Box>
            {confirms.map((confirm, index) => {
              return (
                <TitleItem
                  key={confirm.hash}
                  title={`Hash ${index + 1}`}
                  titleWidth="70px"
                  component={
                    <Box key={confirm.hash} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>{`${formatAddress(
                        confirm.hash,
                        5
                      )}(${confirm.isConfirm.toString()})`}</Typography>
                      <CopyIcon copyText={confirm.hash} />
                    </Box>
                  }
                  props={{ sx: { mt: 2 } }}
                />
              );
            })}
          </Box>
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
    </Box>
  );
}
