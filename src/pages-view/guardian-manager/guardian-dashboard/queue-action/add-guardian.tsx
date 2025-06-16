import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Interface } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { OwnerTransactionType, SIMPLE_EXTEND } from 'src/configs/constance';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import { GuardianHashType } from 'src/global';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress, getEta } from 'src/services';
import { generatePoseidonHash } from 'src/services/guardian-utils';
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
    try {
      const _hash = await generatePoseidonHash(address, 'hex');
      setNewGuardian({ address, hash: _hash });
    } catch (error) {
      toast.error(String(error));
    }
  }

  async function onAddGuardian() {
    try {
      if (!reader) throw Error('reader is not defined');
      if (hashList.includes(newGuardian.hash)) throw Error('address is already exist');
      const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
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
    } catch (error) {
      toast.error(String(error));
    }
  }

  function onClose() {
    setNewGuardian({ address: '', hash: '' });
    setOpen(false);
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
      <BaseDialog title="Add Guardian" open={open} onClose={onClose}>
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
            sx={{ mt: 1 }}
          />
        </BaseForm>
      </BaseDialog>
    </>
  );
}
