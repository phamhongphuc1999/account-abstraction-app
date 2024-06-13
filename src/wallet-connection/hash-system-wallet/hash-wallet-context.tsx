/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SignatureScheme } from 'src/global';
import BaseKeyring from './keyring/base-keyring';
import Ed25519Keyring from './keyring/ed25519-keyring';
import Secp256k1Keyring from './keyring/secp256k1-keyring';

export interface HashWalletContextProps {
  signatureSchema: SignatureScheme | 'null';
  ed25519Keyring: Ed25519Keyring | null;
  secp256k1Keyring: Secp256k1Keyring | null;
  fn: {
    setKeyring: (schema: SignatureScheme, keyring: BaseKeyring) => void;
  };
}

const HashWalletContext = createContext<HashWalletContextProps>({
  signatureSchema: 'null',
  ed25519Keyring: null,
  secp256k1Keyring: null,
  fn: {
    setKeyring: () => {},
  },
});

interface Props {
  children: ReactNode;
}

export default function HashWalletProvider({ children }: Props) {
  const [signatureSchema, setSignatureSchema] = useState<SignatureScheme>('ed25519');
  const [ed25519Keyring, setEd25519Keyring] = useState<Ed25519Keyring | null>(null);
  const [secp256k1Keyring, setSecp256k1Keyring] = useState<Secp256k1Keyring | null>(null);

  const _setKeyring = useCallback((schema: SignatureScheme, keyring: BaseKeyring) => {
    if (schema == 'ed25519') setEd25519Keyring(keyring as Ed25519Keyring);
    else setSecp256k1Keyring(keyring as Secp256k1Keyring);
    setSignatureSchema(schema);
  }, []);

  const contextData = useMemo<HashWalletContextProps>(() => {
    return { signatureSchema, ed25519Keyring, secp256k1Keyring, fn: { setKeyring: _setKeyring } };
  }, [signatureSchema, ed25519Keyring, secp256k1Keyring, _setKeyring]);

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
  const { ed25519Keyring, secp256k1Keyring } = useHashWalletContext();

  return useMemo(() => {
    return schema == 'ed25519' ? { keyring: ed25519Keyring } : { keyring: secp256k1Keyring };
  }, [ed25519Keyring, secp256k1Keyring, schema]);
}
