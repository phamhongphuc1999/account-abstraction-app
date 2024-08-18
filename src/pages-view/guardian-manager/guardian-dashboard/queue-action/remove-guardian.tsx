import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Button, TextField } from '@mui/material';
import { Interface } from 'ethers';
import { useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/form/base-form';
import HashSelect from 'src/components/selector/hash-selector';
import TitleItem from 'src/components/title-item';
import { OwnerTransactionType, SIMPLE_EXTEND } from 'src/configs/constance';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { getEta } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

export default function RemoveGuardian() {
  const [extend, setExtend] = useState(SIMPLE_EXTEND);
  const { reader } = usRpcProviderContext();
  const { sendEntryPoint } = useSendUserOp();
  const [open, setOpen] = useState(false);
  const [removeGuardian, setRemoveGuardian] = useState('');
  const { guardianAddress, config } = useAppSelector((state) => state.guardian);
  const { hashList } = config;

  async function onRemoveGuardianChange(addressHash: string) {
    setRemoveGuardian(addressHash);
  }

  async function onRemoveGuardian() {
    if (reader) {
      const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      const _eta = await getEta(reader, extend);
      if (_eta) {
        let _callData = guardianInter.encodeFunctionData('removeGuardian', [removeGuardian]);
        _callData = guardianInter.encodeFunctionData('queue', [
          0,
          _callData,
          _eta,
          OwnerTransactionType.RemoveGuardian,
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
        startIcon={<RemoveCircleOutlineOutlinedIcon />}
      >
        Remove Guardian
      </Button>
      <BaseDialog title="Remove Guardian" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onRemoveGuardian }}>
          <HashSelect
            id="hash-select"
            hash={removeGuardian}
            hashes={hashList}
            events={{ onSelectItem: onRemoveGuardianChange }}
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
