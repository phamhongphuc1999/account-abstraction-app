import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import { Button, TextField } from '@mui/material';
import { Interface } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/form/base-form';
import TitleItem from 'src/components/title-item';
import { OwnerTransactionType, SIMPLE_EXTEND } from 'src/configs/constance';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { getEta } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

export default function ChangeThreshold() {
  const { guardianAddress, config } = useAppSelector((state) => state.guardian);
  const { threshold: configThreshold } = config;
  const [open, setOpen] = useState(false);
  const [threshold, setThreshold] = useState(configThreshold.toString());
  const [extend, setExtend] = useState(SIMPLE_EXTEND);
  const { reader } = usRpcProviderContext();
  const { sendEntryPoint } = useSendUserOp();

  async function onChangeThreshold() {
    if (configThreshold != parseInt(threshold) && reader) {
      const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      const _eta = await getEta(reader, extend);
      if (_eta) {
        let callData = guardianInter.encodeFunctionData('setThreshold', [threshold]);
        callData = guardianInter.encodeFunctionData('queue', [
          0,
          callData,
          _eta,
          OwnerTransactionType.SetThreshold,
        ]);
        callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, callData]);
        await sendEntryPoint(callData);
      }
    } else toast.info('Nothing change or Reader is undefined');
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} startIcon={<AdjustOutlinedIcon />}>
        Change Threshold
      </Button>
      <BaseDialog title="Change Threshold" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onChangeThreshold }}>
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
      </BaseDialog>
    </>
  );
}
