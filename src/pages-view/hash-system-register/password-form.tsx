import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import BaseForm from 'src/components/form/base-form';
import { TitleTextFieldItem } from 'src/components/title-item';
import { useHashRegisterContext } from 'src/context/hash-register-context';

export default function PasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { fn } = useHashRegisterContext();

  function onSavePassword() {
    if (password == confirmPassword) {
      fn.setPassword(password);
      fn.setStep(3);
    }
  }

  function onCancel() {
    fn.setPassword('');
    fn.setStep(1);
  }

  return (
    <>
      <Typography variant="subtitle1">Step 2: Create your Password</Typography>
      <BaseForm
        component={{
          Footer: (
            <Button variant="outlined" onClick={onCancel}>
              Back
            </Button>
          ),
        }}
        events={{ onExecute: onSavePassword }}
      >
        <TitleTextFieldItem
          titleWidth="80px"
          title="Password"
          isPassword={true}
          textFieldProps={{
            fullWidth: true,
            value: password,
            onChange: (event) => setPassword(event.target.value),
          }}
          props={{ sx: { mt: 1 } }}
        />
        <TitleTextFieldItem
          titleWidth="80px"
          title="Confirm Password"
          isPassword={true}
          textFieldProps={{
            fullWidth: true,
            value: confirmPassword,
            onChange: (event) => setConfirmPassword(event.target.value),
          }}
          props={{ sx: { mt: 1 } }}
        />
      </BaseForm>
    </>
  );
}
