import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import BaseForm from 'src/components/form/base-form';
import { useHashRegisterContext } from 'src/context/hash-register-context';
import { SignatureScheme } from 'src/global';

export default function ChooseSignatureSchema() {
  const [schema, setSchema] = useState<SignatureScheme>('ed25519');
  const { fn } = useHashRegisterContext();

  function onSaveSchema() {
    fn.setSignatureSchema(schema);
    fn.setStep(2);
  }

  return (
    <>
      <Typography variant="subtitle1">Step 1: Choose signature schema</Typography>
      <BaseForm events={{ onExecute: onSaveSchema }}>
        <Button
          sx={{ mt: 1 }}
          variant="outlined"
          onClick={() =>
            setSchema((preValue) => {
              return preValue == 'ed25519' ? 'ecdsa' : 'ed25519';
            })
          }
        >
          {schema == 'ed25519' ? 'ed25519' : 'ecdsa'}
        </Button>
      </BaseForm>
    </>
  );
}
