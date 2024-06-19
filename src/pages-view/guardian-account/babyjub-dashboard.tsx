import { TextField } from '@mui/material';
import { buildBabyjub, buildEddsa } from 'circomlibjs';
import { useCallback, useEffect, useMemo } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { convertStringToUint8, convertUint8ToString } from 'src/services';
import { decodeMnemonic } from 'src/services/encrypt';
import BabyjubAccount from 'src/wallet-connection/hash-system-wallet/hash-account/babyjub-account';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import BabyJubSignature from './babyjub-signature';

export default function BabyjubDashboard() {
  const { jubAccount, pacPubKey, fn } = useBabyJub();
  const { indexedStorage } = useLocalStorageContext();

  const _recover = useCallback(async () => {
    if (indexedStorage && !jubAccount) {
      const _metadata = await indexedStorage.hashWalletMetadata.get('babyjub');
      if (_metadata) {
        const { mnemonic } = _metadata;
        const realMnemonic = await decodeMnemonic(mnemonic, '1111');
        const _privateKey = convertStringToUint8(realMnemonic);
        const eddsa = await buildEddsa();
        const babyJub = await buildBabyjub();
        const _account = new BabyjubAccount(eddsa, babyJub, _privateKey);
        fn.setBabyjubAccount(_account);
      }
    }
  }, [indexedStorage, fn, jubAccount]);

  const _privateKey = useMemo(() => {
    if (jubAccount) return convertUint8ToString(jubAccount.privateKey);
    else return '';
  }, [jubAccount]);

  useEffect(() => {
    _recover();
  }, [_recover]);

  return jubAccount ? (
    <>
      <TitleItem
        props={{ sx: { mt: 1 } }}
        titleWidth="95px"
        title="Private key"
        component={
          <TextField
            fullWidth
            value={_privateKey}
            InputProps={{ readOnly: true, endAdornment: <CopyIcon copyText={_privateKey} /> }}
          />
        }
      />
      <TitleItem
        props={{ sx: { mt: 1 } }}
        titleWidth="95px"
        title="Public key"
        component={
          <TextField
            fullWidth
            value={pacPubKey}
            InputProps={{ readOnly: true, endAdornment: <CopyIcon copyText={pacPubKey} /> }}
          />
        }
      />
      <BabyJubSignature babyJubAccount={jubAccount} />
    </>
  ) : (
    <></>
  );
}
