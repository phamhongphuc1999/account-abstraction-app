import { Dispatch, ReactNode, createContext, useContext, useMemo, useState } from 'react';

export interface HashRegisterContextProps {
  password: string;
  mnemonic: string;
  step: number;
  fn: {
    setPassword: Dispatch<React.SetStateAction<string>>;
    setStep: Dispatch<React.SetStateAction<number>>;
    setMnemonic: Dispatch<React.SetStateAction<string>>;
  };
}

const HashRegisterContext = createContext<HashRegisterContextProps>({
  password: '',
  mnemonic: '',
  step: 1,
  fn: {
    setPassword: () => {},
    setStep: () => {},
    setMnemonic: () => {},
  },
});

interface Props {
  children: ReactNode;
}

export default function HashRegisterProvider({ children }: Props) {
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [step, setStep] = useState(2);

  const contextData = useMemo(() => {
    return { password, mnemonic, step, fn: { setPassword, setStep, setMnemonic } };
  }, [password, mnemonic, step]);

  return (
    <HashRegisterContext.Provider value={contextData}>{children}</HashRegisterContext.Provider>
  );
}

export function useHashRegisterContext() {
  return useContext(HashRegisterContext);
}
