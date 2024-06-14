/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { HashWalletType, SignatureScheme } from 'src/global';
import BaseKeyring from './keyring/base-keyring';
import Ed25519Keyring from './keyring/ed25519-keyring';
import Secp256k1Keyring from './keyring/secp256k1-keyring';

export type KeyringType = Ed25519Keyring | Secp256k1Keyring;

export interface HashWalletContextProps {
  metadata: HashWalletType | null;
  ed25519Keyring: Ed25519Keyring | null;
  secp256k1Keyring: Secp256k1Keyring | null;
  fn: {
    setKeyring: (schema: SignatureScheme, keyring: BaseKeyring) => void;
    setMetadata: Dispatch<React.SetStateAction<HashWalletType | null>>;
  };
}

const HashWalletContext = createContext<HashWalletContextProps>({
  metadata: null,
  ed25519Keyring: null,
  secp256k1Keyring: null,
  fn: {
    setKeyring: () => {},
    setMetadata: () => {},
  },
});

interface Props {
  children: ReactNode;
}

export default function HashWalletProvider({ children }: Props) {
  const [metadata, setMetadata] = useState<HashWalletType | null>(null);
  const [ed25519Keyring, setEd25519Keyring] = useState<Ed25519Keyring | null>(null);
  const [secp256k1Keyring, setSecp256k1Keyring] = useState<Secp256k1Keyring | null>(null);

  const _setKeyring = useCallback((schema: SignatureScheme, keyring: BaseKeyring) => {
    if (schema == 'ed25519') setEd25519Keyring(keyring as Ed25519Keyring);
    else setSecp256k1Keyring(keyring as Secp256k1Keyring);
  }, []);

  const contextData = useMemo<HashWalletContextProps>(() => {
    return {
      metadata,
      ed25519Keyring,
      secp256k1Keyring,
      fn: { setKeyring: _setKeyring, setMetadata },
    };
  }, [metadata, ed25519Keyring, secp256k1Keyring, _setKeyring]);

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
  const { ed25519Keyring, secp256k1Keyring, metadata } = useHashWalletContext();

  return useMemo(() => {
    return schema == 'ed25519'
      ? { keyring: ed25519Keyring, metadata }
      : { keyring: secp256k1Keyring, metadata };
  }, [ed25519Keyring, secp256k1Keyring, schema, metadata]);
}
