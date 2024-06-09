import { openDB } from 'idb';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import IndexedStorage from './indexed-storage';

export interface LocalStorageContextProps {
  indexedStorage: IndexedStorage | null;
}

const LocalStorageContext = createContext<LocalStorageContextProps>({
  indexedStorage: null,
});

interface Props {
  children: ReactNode;
}

export default function LocalStorageProvider({ children }: Props) {
  const [indexedStorage, setIndexedStorage] = useState<IndexedStorage | null>(null);

  const fetch = useCallback(async () => {
    const db = await openDB('mvp-wallet', 1, {
      upgrade: (db) => {
        db.createObjectStore('tokens');
        db.createObjectStore('hashWalletMetadata');
      },
    });
    const _indexedStorage = new IndexedStorage(db, 'aa-wallet');
    setIndexedStorage(_indexedStorage);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const contextData = useMemo<LocalStorageContextProps>(() => {
    return { indexedStorage };
  }, [indexedStorage]);

  return (
    <LocalStorageContext.Provider value={contextData}>{children}</LocalStorageContext.Provider>
  );
}

export function useLocalStorageContext() {
  return useContext(LocalStorageContext);
}
