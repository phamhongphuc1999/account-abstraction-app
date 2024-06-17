import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import BaseForm from 'src/components/form/base-form';
import { TitleTextFieldItem } from 'src/components/title-item';
import { useHashRegisterContext } from 'src/context/hash-register-context';

interface Props {
  step?: number;
}

export default function PasswordForm({ step = 2 }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { fn } = useHashRegisterContext();

  function onSavePassword() {
    if (password == confirmPassword) {
      fn.setPassword(password);
      fn.setStep(step + 1);
    }
  }

  function onCancel() {
    fn.setPassword('');
    fn.setStep(1);
  }

  return (
    <>
      <Typography variant="subtitle1">{`Step ${step}: Create your Password`}</Typography>
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
