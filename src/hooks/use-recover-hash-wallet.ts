import { useCallback } from 'react';
import { INDEXED_WALLET_KEY } from 'src/configs/constance';
import { HashDataType } from 'src/context/hash-register-context';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { changeWalletType, setNetworkConfig } from 'src/redux-slices/config-slice';
import { useAppDispatch } from 'src/redux-slices/store';
import { updateAccountConfig } from 'src/redux-slices/user-slice';
import { decodeMnemonic, encodeMnemonic } from 'src/services/encrypt';
import { useHashWalletContext } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import Ed25519Keyring from 'src/wallet-connection/hash-system-wallet/keyring/ed25519-keyring';
import Secp256k1Keyring from 'src/wallet-connection/hash-system-wallet/keyring/secp256k1-keyring';

export default function useRecoverHashWallet() {
  const { fn } = useHashWalletContext();
  const dispatch = useAppDispatch();
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
      fn.setKeyring(signatureSchema, keyring);
    },
    [fn, indexedStorage]
  );

  const _recover = useCallback(
    async (password: string) => {
      if (indexedStorage) {
        try {
          const _metadata = await indexedStorage.hashWalletMetadata.getAll();
          if (_metadata.length > 0) {
            const { mnemonic, schema } = _metadata[0];
            const realMnemonic = await decodeMnemonic(mnemonic, password);
            const keyring = schema == 'ed25519' ? new Ed25519Keyring() : new Secp256k1Keyring();
            keyring.initFromMnemonic(realMnemonic);
            const accounts = keyring.addKeys();
            fn.setKeyring(schema, keyring);
            dispatch(setNetworkConfig({ chainId: 97, connector: 'hash-system' }));
            dispatch(changeWalletType({ walletType: schema }));
            dispatch(updateAccountConfig({ ownerAddress: accounts[0].getEVMAddress() }));
            return true;
          } else return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      } else return false;
    },
    [fn, indexedStorage, dispatch]
  );

  return { importFn: _import, recoverFn: _recover };
}
