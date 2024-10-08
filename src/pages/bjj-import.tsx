import { Box, BoxProps, Typography } from '@mui/material';
import { buildBabyjub, buildEddsa } from 'circomlibjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseForm from 'src/components/form/base-form';
import ReactSeo from 'src/components/ReactSeo';
import { TitleTextFieldItem } from 'src/components/title-item';
import HashRegisterProvider, { useHashRegisterSelector } from 'src/context/hash-register-context';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import PasswordForm from 'src/pages-view/curve-register-view/password-form';
import { convertStringToUint8 } from 'src/services';
import { encodeMnemonic } from 'src/services/encrypt';
import BJJAccount from 'src/wallet-connection/hash-system-wallet/hash-account/bjj-account';
import { useHashWalletContext } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

function BJJImportLayout(props: BoxProps) {
  const { step, password } = useHashRegisterSelector((state) => state.data);
  const [privateKey, setPrivateKey] = useState('');
  const { indexedStorage } = useLocalStorageContext();
  const { fn } = useHashWalletContext();
  const navigate = useNavigate();

  async function _buildBabyJub() {
    if (privateKey.length > 0) {
      const eddsa = await buildEddsa();
      const babyJub = await buildBabyjub();
      const _account = new BJJAccount(eddsa, babyJub, convertStringToUint8(privateKey));
      if (indexedStorage) {
        const encryptMnemonic = await encodeMnemonic(privateKey, password);
        await indexedStorage.hashWalletMetadata.upsert('babyjub', {
          mnemonic: encryptMnemonic,
          numberOfKeys: 1,
          schema: 'babyjub',
        });
        fn.setBabyJubAccount(_account);
        navigate('/guardian/account');
      }
    }
  }

  return (
    <Box {...props}>
      {step == 1 && (
        <PasswordForm
          step={1}
          seoProps={{ title: 'Guardian Key Import | Password', isShowDefault: false }}
        />
      )}
      {step == 2 && (
        <>
          <ReactSeo title="Guardian Key Import | Private Key" />
          <BaseForm events={{ onExecute: _buildBabyJub }}>
            <TitleTextFieldItem
              titleWidth="95px"
              title="Private Key"
              textFieldProps={{
                fullWidth: true,
                value: privateKey,
                onChange: (event) => setPrivateKey(event.target.value),
              }}
              sx={{ mt: 1 }}
            />
          </BaseForm>
        </>
      )}
    </Box>
  );
}

export default function BJJImport() {
  return (
    <HashRegisterProvider>
      <Typography variant="subtitle1">Guardian Key Import</Typography>
      <BJJImportLayout sx={{ mt: 2 }} />
    </HashRegisterProvider>
  );
}
