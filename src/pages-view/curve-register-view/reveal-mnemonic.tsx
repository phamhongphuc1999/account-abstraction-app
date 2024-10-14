import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
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
    fn.setStep(4);
  }

  function onCancel() {
    fn.setMnemonic('');
    fn.setStep(2);
  }

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Step 3: Reveal Mnemonic
      </Typography>
      <BaseForm
        component={{
          Footer: (
            <Button variant="outlined" onClick={onCancel}>
              Back
            </Button>
          ),
        }}
        events={{ onExecute: onSaveMnemonic }}
      >
        <TextField
          fullWidth
          value={mnemonic}
          slotProps={{
            input: {
              readOnly: true,
              endAdornment:
                mnemonic.length > 0 ? (
                  <CopyIcon copyText={mnemonic} />
                ) : (
                  <Button
                    disabled={mnemonic.length > 0}
                    variant="outlined"
                    onClick={onCreateMnemonic}
                  >
                    Create mnemonic
                  </Button>
                ),
            },
          }}
          maxRows={4}
        />
      </BaseForm>
    </>
  );
}
