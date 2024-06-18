import { Box, Typography, useTheme } from '@mui/material';
import { buildBabyjub, buildEddsa } from 'circomlibjs';
import { useCallback, useEffect } from 'react';
import CssReactJson from 'src/components/css-react-json';
import TitleItem from 'src/components/title-item';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { convertStringToUint8, convertUint8ToString } from 'src/services';
import { decodeMnemonic } from 'src/services/encrypt';
import BabyjubAccount from 'src/wallet-connection/hash-system-wallet/hash-account/babyjub-account';
import { useHashWalletContext } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import BabyJubSignature from './babyjub-signature';

export default function BabyjubDashboard() {
  const theme = useTheme();
  const { babyjubAccount, fn } = useHashWalletContext();
  const { indexedStorage } = useLocalStorageContext();

  const _recover = useCallback(async () => {
    if (indexedStorage && !babyjubAccount) {
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
  }, [indexedStorage, fn, babyjubAccount]);

  useEffect(() => {
    _recover();
  }, [_recover]);

  return (
    <Box sx={{ borderTop: `1px solid ${theme.palette.background.primary}`, mt: 3 }}>
      <Typography>BabyJubJub</Typography>
      {babyjubAccount && (
        <>
          <TitleItem
            titleWidth="80px"
            title="Key"
            component={
              <CssReactJson
                jsonProps={{
                  src: {
                    privateKey: convertUint8ToString(babyjubAccount.privateKey),
                    publicKey: {
                      x: convertUint8ToString(babyjubAccount.pubKey[0]),
                      y: convertUint8ToString(babyjubAccount.pubKey[1]),
                    },
                  },
                  collapsed: true,
                }}
              />
            }
            props={{ sx: { mt: 1, alignItems: 'flex-start' } }}
          />
          <BabyJubSignature babyJubAccount={babyjubAccount} />
        </>
      )}
    </Box>
  );
}
