/* eslint-disable quotes */
import { Box, BoxProps, TextField, Typography } from '@mui/material';
import { Interface, ZeroAddress, isAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { SIMPLE_SALT } from 'src/configs/constance';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import { useZKGuardianContract } from 'src/contracts/zk-guardian-contract';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';
import { useAddressesQuery } from 'src/services/static-query';

interface Props extends BoxProps {
  enoughConfirm: boolean;
  tempNewOwner: string;
}

export default function OwnerRecovery({ enoughConfirm, tempNewOwner, ...props }: Props) {
  const { ownerAddress } = useAppSelector((state) => state.user);
  const { guardianAddress, config } = useAppSelector((state) => state.guardian);
  const { hashList } = config;
  const [newOwner, setNewOwner] = useState('');
  const [confirms, setConfirms] = useState<Array<{ hash: string; isConfirm: boolean }>>([]);
  const { sendEntryPoint } = useSendUserOp();
  const guardianContract = useZKGuardianContract();
  const { ACCOUNT_FACTORY_ADDRESS } = useAddressesQuery();

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
    try {
      if (!isAddress(newOwner)) throw Error('newOwner is invalid');
      if (newOwner.toLowerCase() == ownerAddress) throw Error('newOwner is same as ownerAddress');
      const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('submitNewOwner', [
        newOwner,
        ACCOUNT_FACTORY_ADDRESS,
        SIMPLE_SALT,
      ]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    } catch (error) {
      toast.error(String(error));
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
                  sx={{ mt: 2 }}
                />
              );
            })}
          </Box>
          <TitleItem
            titleWidth="100px"
            title="New Owner"
            component={
              <TextField fullWidth value={tempNewOwner} slotProps={{ input: { readOnly: true } }} />
            }
            sx={{ mt: 1 }}
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
