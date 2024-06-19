import { Button, TextField } from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/form/base-form';
import TitleItem from 'src/components/title-item';
import ZKGuardianContract from 'src/contracts/zk-guardian-contract';
import { ProofCallDataType } from 'src/global';
import useHandleEmit from 'src/hooks/use-handle-emit';
import { analyticError } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  calldata: ProofCallDataType;
}

export default function SubmitProof({ calldata }: Props) {
  const [open, setOpen] = useState(false);
  const [guardianAddress, setGuardianAddress] = useState('');
  const { signer } = usRpcProviderContext();
  const { createEmit, handleEmit, detectEmitError } = useHandleEmit();

  function onOpen() {
    setOpen(true);
  }

  async function onSubmitProof() {
    if (signer && isAddress(guardianAddress)) {
      const id = createEmit('submit proof');
      try {
        const { pA, pB, pC, pubSignals } = calldata;
        const guardianContract = new ZKGuardianContract(signer, guardianAddress);
        const tx = await guardianContract.fn.confirmChangeOwner(pA, pB, pC, pubSignals);
        await handleEmit(tx, id);
      } catch (error) {
        const sError = analyticError(error);
        toast.error(sError);
        detectEmitError(id, sError);
      }
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={onOpen} sx={{ ml: 1 }}>
        Submit proof
      </Button>
      <BaseDialog title="Submit Proof" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onSubmitProof }}>
          <TitleItem
            title="Guardian Address"
            titleWidth="100px"
            component={
              <TextField
                fullWidth
                value={guardianAddress}
                onChange={(event) => setGuardianAddress(event.target.value)}
              />
            }
          />
        </BaseForm>
      </BaseDialog>
    </>
  );
}
