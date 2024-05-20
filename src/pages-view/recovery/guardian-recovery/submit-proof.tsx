import { Button, TextField } from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import TitleItem from 'src/components/title-item';
import { HashGuardianContract } from 'src/contracts/hash-guardian-contract';
import { ProofCallDataType } from 'src/global';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  calldata: ProofCallDataType;
}

export default function SubmitProof({ calldata }: Props) {
  const [open, setOpen] = useState(false);
  const [guardianAddress, setGuardianAddress] = useState('');
  const { signer } = usRpcProviderContext();

  function onOpen() {
    setOpen(true);
  }

  async function onSubmitProof() {
    if (signer && isAddress(guardianAddress)) {
      const { pA, pB, pC, pubSignals } = calldata;
      const guardianContract = new HashGuardianContract(signer, guardianAddress);
      const tx = await guardianContract.fn.confirmChangeOwner(pA, pB, pC, pubSignals);
      await tx.wait();
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={onOpen} sx={{ ml: 1 }}>
        Submit proof
      </Button>
      <BaseAccountDialog title="Submit Proof" open={open} onClose={() => setOpen(false)}>
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
      </BaseAccountDialog>
    </>
  );
}
