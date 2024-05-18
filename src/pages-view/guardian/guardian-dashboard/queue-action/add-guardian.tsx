import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Interface } from 'ethers';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { OwnerTransactionType, SIMPLE_EXTEND } from 'src/configs/constance';
import { AccountAbi__factory, HashGuardianAbi__factory } from 'src/contracts/typechain';
import { GuardianHashType } from 'src/global';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/hook';
import { formatAddress, getEta } from 'src/services';
import { generatePoseidonHash } from 'src/services/circom-utils';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

export default function AddGuardian() {
  const [extend, setExtend] = useState(SIMPLE_EXTEND);
  const { reader } = usRpcProviderContext();
  const { sendEntryPoint } = useSendUserOp();
  const [open, setOpen] = useState(false);
  const [newGuardian, setNewGuardian] = useState<GuardianHashType>({ address: '', hash: '' });
  const { guardianAddress, config } = useAppSelector((state) => state.guardian);
  const { hashList } = config;

  async function onNewGuardianChange(address: string) {
    const _hash = await generatePoseidonHash(address, 'hex');
    setNewGuardian({ address, hash: _hash });
  }

  async function onAddGuardian() {
    if (reader && !hashList.includes(newGuardian.hash)) {
      const guardianInter = new Interface(HashGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      const _eta = await getEta(reader, extend);
      if (_eta) {
        let _callData = guardianInter.encodeFunctionData('addGuardian', [newGuardian.hash]);
        _callData = guardianInter.encodeFunctionData('queue', [
          0,
          _callData,
          _eta,
          OwnerTransactionType.AddGuardian,
        ]);
        _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
        await sendEntryPoint(_callData);
      }
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<AddCircleOutlineOutlinedIcon />}
      >
        Add Guardian
      </Button>
      <BaseAccountDialog title="Add Guardian" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onAddGuardian }}>
          {newGuardian.hash.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{`Hash: ${formatAddress(newGuardian.hash, 5)}`}</Typography>
              <CopyIcon copyText={newGuardian.hash} />
            </Box>
          )}
          <TitleItem
            titleWidth="110px"
            title="New Guardian"
            component={
              <TextField
                fullWidth
                value={newGuardian.address}
                onChange={(event) => onNewGuardianChange(event.target.value)}
              />
            }
          />
          <TitleItem
            titleWidth="110px"
            title="Extend"
            component={
              <TextField
                fullWidth
                value={extend}
                onChange={(event) => setExtend(parseInt(event.target.value))}
              />
            }
            props={{ sx: { mt: 1 } }}
          />
        </BaseForm>
      </BaseAccountDialog>
    </>
  );
}
