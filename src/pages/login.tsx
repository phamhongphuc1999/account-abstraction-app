import { useState } from 'react';
import { WalletKeyType } from 'src/global';
import HashSystemLogin from 'src/pages-view/login/hash-system-login';
import LoginForm from 'src/pages-view/login/login-form';

export default function Login() {
  const [mode, setMode] = useState<WalletKeyType>('wagmi');

  return (
    <>
      {mode == 'wagmi' && <LoginForm setMode={setMode} />}
      {mode == 'hash-system' && <HashSystemLogin />}
    </>
  );
}
