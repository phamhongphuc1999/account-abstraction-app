import { Box, Typography } from '@mui/material';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { HashWalletType } from 'src/global';
import { formatAddress } from 'src/services';
import { KeyringType } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

interface Props {
  keyring: KeyringType;
  metadata: HashWalletType;
}

export default function CurveDashboard({ keyring, metadata }: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <TitleItem titleWidth="95px" title="Account" component={<Typography>Account 0</Typography>} />
      <TitleItem
        titleWidth="95px"
        title="public key"
        component={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{`${formatAddress(keyring.accounts[0].publicKey, 6)}`}</Typography>
            <CopyIcon
              copyText={keyring.accounts[0].publicKey}
              iconProps={{ sx: { fontSize: '14px' } }}
            />
          </Box>
        }
      />
      {metadata.hdPath && (
        <TitleItem
          titleWidth="95px"
          title="Path"
          component={<Typography>{metadata.hdPath}</Typography>}
        />
      )}
    </Box>
  );
}
