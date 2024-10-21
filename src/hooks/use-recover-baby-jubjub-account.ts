import { buildBabyjub, buildEddsa } from 'circomlibjs';
import { useCallback, useEffect } from 'react';
import { HARDCODE_PASSWORD } from 'src/configs/constance';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { convertStringToUint8 } from 'src/services';
import { decodeMnemonic } from 'src/services/encrypt';
import BJJAccount from 'src/wallet-connection/hash-system-wallet/hash-account/bjj-account';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

export default function useRecoverBabyJubjubAccount() {
  const { jubAccount, fn } = useBabyJub();
  const { indexedStorage } = useLocalStorageContext();

  const _recover = useCallback(async () => {
    if (indexedStorage && !jubAccount) {
      const _metadata = await indexedStorage.hashWalletMetadata.get('babyjub');
      if (_metadata) {
        const { mnemonic } = _metadata;
        const realMnemonic = await decodeMnemonic(mnemonic, HARDCODE_PASSWORD);
        const _privateKey = convertStringToUint8(realMnemonic);
        const eddsa = await buildEddsa();
        const babyJub = await buildBabyjub();
        const _account = new BJJAccount(eddsa, babyJub, _privateKey);
        fn.setBabyJubAccount(_account);
      }
    }
  }, [indexedStorage, fn, jubAccount]);

  useEffect(() => {
    _recover();
  }, [_recover]);
}
