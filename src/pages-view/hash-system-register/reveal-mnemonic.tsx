import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import BaseForm from 'src/components/form/base-form';
import { useHashRegisterContext } from 'src/context/hash-register-context';
import BaseKeyring from 'src/wallet-connection/hash-system-wallet/keyring/base-keyring';

export default function RevealMnemonic() {
  const { fn } = useHashRegisterContext();
  const [mnemonic, setMnemonic] = useState('');

  function onCreateMnemonic() {
    if (mnemonic.length == 0) {
      const _mnemonic = BaseKeyring.generateRandomMnemonic();
      setMnemonic(_mnemonic);
    }
  }

  function onSaveMnemonic() {
    fn.setMnemonic(mnemonic);
    fn.setStep(3);
  }

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Step 2: Reveal Mnemonic
      </Typography>
      <BaseForm events={{ onExecute: onSaveMnemonic }}>
        <TextField
          fullWidth
          value={mnemonic}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Button disabled={mnemonic.length > 0} variant="outlined" onClick={onCreateMnemonic}>
                Create mnemonic
              </Button>
            ),
          }}
          maxRows={4}
        />
      </BaseForm>
    </>
  );
}
