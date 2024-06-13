import { useCallback } from 'react';
import { INDEXED_WALLET_KEY } from 'src/configs/constance';
import { HashDataType } from 'src/context/hash-register-context';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { encodeMnemonic } from 'src/services/encrypt';
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
        await indexedStorage.hashWalletMetadata.upsert(INDEXED_WALLET_KEY, {
          mnemonic: encryptMnemonic,
          numberOfKeys: 1,
          schema: signatureSchema,
        });
      }
      if (signatureSchema == 'ed25519') fn.setEd25519Keyring(keyring as Ed25519Keyring);
      else fn.setSecp256k1Keyring(keyring as Secp256k1Keyring);
    },
    [fn, indexedStorage]
  );

  return { importFn: _import };
}
