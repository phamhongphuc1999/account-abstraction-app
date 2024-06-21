import { Box, Button, TextField, Typography } from '@mui/material';
import { randomBytes } from '@noble/hashes/utils';
import { buildBabyjub, buildEddsa } from 'circomlibjs';
import { useState } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { useHashRegisterSelector } from 'src/context/hash-register-context';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { convertUint8ToString } from 'src/services';
import { encodeMnemonic } from 'src/services/encrypt';
import BJJAccount from 'src/wallet-connection/hash-system-wallet/hash-account/bjj-account';
import { useHashWalletContext } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

export default function RevealPrivateKey() {
  const { fn } = useHashWalletContext();
  const { indexedStorage } = useLocalStorageContext();
  const { password } = useHashRegisterSelector((state) => state.data);
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);

  function onCreatePrivateKey() {
    setPrivateKey(randomBytes(32));
  }

  async function _buildBabyjub() {
    if (privateKey) {
      const eddsa = await buildEddsa();
      const babyJub = await buildBabyjub();
      const _account = new BJJAccount(eddsa, babyJub, privateKey);
      if (indexedStorage) {
        const encryptMnemonic = await encodeMnemonic(convertUint8ToString(privateKey), password);
        await indexedStorage.hashWalletMetadata.upsert('babyjub', {
          mnemonic: encryptMnemonic,
          numberOfKeys: 1,
          schema: 'babyjub',
        });
        fn.setBabyJubAccount(_account);
      }
    }
  }

  return (
    <>
      <Typography variant="subtitle1">Step 2: Reveal babyjubjub private key</Typography>
      <TitleItem
        props={{ sx: { mt: 2 } }}
        title="Private key"
        titleWidth="95px"
        component={
          <TextField
            value={privateKey ? Buffer.from(privateKey).toString('hex') : ''}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: privateKey ? (
                <CopyIcon copyText={Buffer.from(privateKey).toString('hex')} />
              ) : (
                <Button variant="contained" onClick={onCreatePrivateKey}>
                  Create
                </Button>
              ),
            }}
          />
        }
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button variant="outlined" onClick={_buildBabyjub}>
          Create Babyjub
        </Button>
      </Box>
    </>
  );
}
