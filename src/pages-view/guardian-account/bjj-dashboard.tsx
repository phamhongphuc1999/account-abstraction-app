import { TextField } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { CssDivide } from 'src/components/utils';
import useRecoverBabyJubjubAccount from 'src/hooks/use-recover-baby-jubjub-account';
import { convertUint8ToString } from 'src/services';
import { generatePoseidonHash } from 'src/services/guardian-utils';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import BabyJubSignature from './bjj-signature';

export default function BJJDashboard() {
  const { jubAccount, pacPubKey } = useBabyJub();
  const [poseidonPubKey, setPoseidonPubKey] = useState('');
  useRecoverBabyJubjubAccount();

  const _getPoseidonKey = useCallback(async () => {
    setPoseidonPubKey(await generatePoseidonHash(pacPubKey, 'hex'));
  }, [pacPubKey]);

  const _privateKey = useMemo(() => {
    if (jubAccount) return convertUint8ToString(jubAccount.privateKey);
    else return '';
  }, [jubAccount]);

  useEffect(() => {
    _getPoseidonKey();
  }, [_getPoseidonKey]);

  return jubAccount ? (
    <>
      <TitleItem
        sx={{ mt: 1 }}
        titleWidth="95px"
        title="Private key"
        component={
          <TextField
            fullWidth
            value={_privateKey}
            slotProps={{
              input: { readOnly: true, endAdornment: <CopyIcon copyText={_privateKey} /> },
            }}
          />
        }
      />
      <TitleItem
        sx={{ mt: 1 }}
        titleWidth="95px"
        title="Public key"
        component={
          <TextField
            fullWidth
            value={pacPubKey}
            slotProps={{
              input: { readOnly: true, endAdornment: <CopyIcon copyText={pacPubKey} /> },
            }}
          />
        }
      />
      <TitleItem
        sx={{ mt: 1 }}
        titleWidth="95px"
        title="Poseidon public key"
        component={
          <TextField
            fullWidth
            value={poseidonPubKey}
            slotProps={{
              input: { readOnly: true, endAdornment: <CopyIcon copyText={poseidonPubKey} /> },
            }}
          />
        }
      />
      <CssDivide sx={{ marginTop: 2, marginBottom: 2 }} />
      <BabyJubSignature babyJubAccount={jubAccount} />
    </>
  ) : (
    <></>
  );
}
