import { TextField } from '@mui/material';
import { buildBabyjub, buildEddsa } from 'circomlibjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { CssDivide } from 'src/components/utils';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { convertStringToUint8, convertUint8ToString } from 'src/services';
import { generatePoseidonHash } from 'src/services/circom-utils';
import { decodeMnemonic } from 'src/services/encrypt';
import BJJAccount from 'src/wallet-connection/hash-system-wallet/hash-account/bjj-account';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import BabyJubSignature from './bjj-signature';

export default function BJJDashboard() {
  const { jubAccount, pacPubKey, fn } = useBabyJub();
  const { indexedStorage } = useLocalStorageContext();
  const [poseidonPubKey, setPoseidonPubKey] = useState('');

  const _recover = useCallback(async () => {
    if (indexedStorage && !jubAccount) {
      const _metadata = await indexedStorage.hashWalletMetadata.get('babyjub');
      if (_metadata) {
        const { mnemonic } = _metadata;
        const realMnemonic = await decodeMnemonic(mnemonic, '1111');
        const _privateKey = convertStringToUint8(realMnemonic);
        const eddsa = await buildEddsa();
        const babyJub = await buildBabyjub();
        const _account = new BJJAccount(eddsa, babyJub, _privateKey);
        fn.setBabyJubAccount(_account);
      }
    }
  }, [indexedStorage, fn, jubAccount]);

  const _getPoseidonKey = useCallback(async () => {
    setPoseidonPubKey(await generatePoseidonHash(pacPubKey, 'hex'));
  }, [pacPubKey]);

  const _privateKey = useMemo(() => {
    if (jubAccount) return convertUint8ToString(jubAccount.privateKey);
    else return '';
  }, [jubAccount]);

  useEffect(() => {
    _recover();
  }, [_recover]);

  useEffect(() => {
    _getPoseidonKey();
  }, [_getPoseidonKey]);

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
      <TitleItem
        props={{ sx: { mt: 1 } }}
        titleWidth="95px"
        title="Poseidon public key"
        component={
          <TextField
            fullWidth
            value={poseidonPubKey}
            InputProps={{ readOnly: true, endAdornment: <CopyIcon copyText={poseidonPubKey} /> }}
          />
        }
      />
      <CssDivide props={{ sx: { mt: 2 } }} />
      <BabyJubSignature babyJubAccount={jubAccount} />
    </>
  ) : (
    <></>
  );
}
