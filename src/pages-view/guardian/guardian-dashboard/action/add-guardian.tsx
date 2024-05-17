import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import { GuardianHashListType } from 'src/global';
import { generatePoseidonHash } from 'src/services/circom-utils';
import GuardianAddresses from '../../guardian-config/guardian-addresses';

export default function AddGuardian() {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<GuardianHashListType>({});

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

  async function onAddGuardian() {
    //
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
          <GuardianAddresses value={addresses} events={{ onAdd, onRemove }} />
        </BaseForm>
      </BaseAccountDialog>
    </>
  );
}
