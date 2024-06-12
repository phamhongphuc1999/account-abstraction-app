/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { SignatureScheme } from 'src/global';

export interface HashRegisterContextProps {
  data: { signatureSchema: SignatureScheme; password: string; mnemonic: string; step: number };
  fn: {
    setSignatureSchema: Dispatch<React.SetStateAction<SignatureScheme>>;
    setPassword: Dispatch<React.SetStateAction<string>>;
    setStep: Dispatch<React.SetStateAction<number>>;
    setMnemonic: Dispatch<React.SetStateAction<string>>;
  };
}

const HashRegisterContext = createContext<HashRegisterContextProps>({
  data: { signatureSchema: 'ed125519', password: '', mnemonic: '', step: 1 },
  fn: {
    setSignatureSchema: () => {},
    setPassword: () => {},
    setStep: () => {},
    setMnemonic: () => {},
  },
});

interface Props {
  children: ReactNode;
}

export default function HashRegisterProvider({ children }: Props) {
  const [signatureSchema, setSignatureSchema] = useState<SignatureScheme>('ed125519');
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [step, setStep] = useState(1);

  const contextData = useMemo(() => {
    return {
      data: { signatureSchema, password, mnemonic, step },
      fn: { setSignatureSchema, setPassword, setStep, setMnemonic },
    };
  }, [signatureSchema, password, mnemonic, step]);

  return (
    <HashRegisterContext.Provider value={contextData}>{children}</HashRegisterContext.Provider>
  );
}

export function useHashRegisterContext() {
  return useContext(HashRegisterContext);
}

export function useHashRegisterSelector<T = any>(
  selectorFn: (data: HashRegisterContextProps) => T
) {
  const data = useHashRegisterContext();
  return useMemo(() => {
    return selectorFn(data);
  }, [data, selectorFn]);
}
