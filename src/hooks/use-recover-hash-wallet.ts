import { useCallback } from 'react';
import { HashDataType } from 'src/context/hash-register-context';
import { SignatureScheme } from 'src/global';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { decodeMnemonic, encodeMnemonic } from 'src/services/encrypt';
import { useHashWalletContext } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import Ed25519Keyring from 'src/wallet-connection/hash-system-wallet/keyring/ed25519-keyring';
import Secp256k1Keyring from 'src/wallet-connection/hash-system-wallet/keyring/secp256k1-keyring';

export default function useRecoverHashWallet() {
  const { fn } = useHashWalletContext();
  const { indexedStorage } = useLocalStorageContext();

  const _import = useCallback(
    async (data: HashDataType) => {
      const { signatureSchema, mnemonic, password } = data;
      const keyring = signatureSchema == 'ed25519' ? new Ed25519Keyring() : new Secp256k1Keyring();
      keyring.initFromMnemonic(mnemonic);
      keyring.addKeys();
      if (indexedStorage) {
        const encryptMnemonic = await encodeMnemonic(mnemonic, password);
        await indexedStorage.hashWalletMetadata.upsert(signatureSchema, {
          mnemonic: encryptMnemonic,
          numberOfKeys: 1,
          schema: signatureSchema,
        });
      }
      fn.setKeyring(signatureSchema, keyring);
    },
    [fn, indexedStorage]
  );

  const _recover = useCallback(
    async (_schema: SignatureScheme, password: string) => {
      if (indexedStorage) {
        try {
          const _metadata = await indexedStorage.hashWalletMetadata.get(_schema);
          if (_metadata) {
            const { mnemonic, schema } = _metadata;
            if (_schema != schema) return false;
            const realMnemonic = await decodeMnemonic(mnemonic, password);
            const keyring = schema == 'ed25519' ? new Ed25519Keyring() : new Secp256k1Keyring();
            keyring.initFromMnemonic(realMnemonic);
            keyring.addKeys();
            fn.setKeyring(schema, keyring);
            fn.setMetadata(_metadata);
            return true;
          } else return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      } else return false;
    },
    [fn, indexedStorage]
  );

  return { importFn: _import, recoverFn: _recover };
}
