import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';
import BaseAccountDialog from 'src/components/BaseAccountDialog';
import BaseForm from 'src/components/base-form';
import { GuardianHashListType } from 'src/global';
import { generatePoseidonHash } from 'src/services/circom-utils';
import GuardianAddresses from '../../guardian-config/guardian-addresses';

export default function RemoveGuardian() {
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

  async function onRemoveGuardian() {
    //
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
      <BaseAccountDialog title="Remove Guardian" open={open} onClose={() => setOpen(false)}>
        <BaseForm events={{ onExecute: onRemoveGuardian }}>
          <GuardianAddresses value={addresses} events={{ onAdd, onRemove }} />
        </BaseForm>
      </BaseAccountDialog>
    </>
  );
}
