import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseForm from 'src/components/form/base-form';
import { TitleTextFieldItem } from 'src/components/title-item';
import useRecoverHashWallet from 'src/hooks/use-recover-hash-wallet';

export default function HashSystemLogin() {
  const navigate = useNavigate();
  const { recoverFn } = useRecoverHashWallet();
  const [password, setPassword] = useState('');

  async function onRecover() {
    const isOk = await recoverFn(password);
    if (isOk) navigate('/hash-system');
    else {
      toast.error('Password is invalid');
      setPassword('');
    }
  }

  return (
    <BaseForm events={{ onExecute: onRecover }}>
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
    </BaseForm>
  );
}
