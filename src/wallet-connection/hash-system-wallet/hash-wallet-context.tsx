/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { SignatureScheme } from 'src/global';
import Ed25519Keyring from './keyring/ed25519-keyring';
import Secp256k1Keyring from './keyring/secp256k1-keyring';

export interface HashWalletContextProps {
  ed25519Keyring: Ed25519Keyring | null;
  secp256k1Keyring: Secp256k1Keyring | null;
  fn: {
    setEd25519Keyring: Dispatch<React.SetStateAction<Ed25519Keyring | null>>;
    setSecp256k1Keyring: Dispatch<React.SetStateAction<Secp256k1Keyring | null>>;
  };
}

const HashWalletContext = createContext<HashWalletContextProps>({
  ed25519Keyring: null,
  secp256k1Keyring: null,
  fn: {
    setEd25519Keyring: () => {},
    setSecp256k1Keyring: () => {},
  },
});

interface Props {
  children: ReactNode;
}

export default function HashWalletProvider({ children }: Props) {
  const [ed25519Keyring, setEd25519Keyring] = useState<Ed25519Keyring | null>(null);
  const [secp256k1Keyring, setSecp256k1Keyring] = useState<Secp256k1Keyring | null>(null);

  const contextData = useMemo<HashWalletContextProps>(() => {
    return { ed25519Keyring, secp256k1Keyring, fn: { setEd25519Keyring, setSecp256k1Keyring } };
  }, [ed25519Keyring, secp256k1Keyring]);

  return <HashWalletContext.Provider value={contextData}>{children}</HashWalletContext.Provider>;
}

export function useHashWalletContext() {
  return useContext(HashWalletContext);
}

export function useHashWalletSelector<T = any>(selectorFn: (data: HashWalletContextProps) => T) {
  const data = useHashWalletContext();
  return useMemo(() => {
    return selectorFn(data);
  }, [data, selectorFn]);
}

export function useHashKeyring(schema: SignatureScheme) {
  const { ed25519Keyring, secp256k1Keyring, fn } = useHashWalletContext();

  return useMemo(() => {
    return schema == 'ed25519'
      ? { keyring: ed25519Keyring, setKeyring: fn.setEd25519Keyring }
      : { keyring: secp256k1Keyring, setKeyring: fn.setSecp256k1Keyring };
  }, [ed25519Keyring, secp256k1Keyring, fn, schema]);
}
