import { Close, Launch } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import CopyIcon from 'src/components/icons/copy-icon';
import { CONNECTORS } from 'src/configs/network-config';
import { useExplorerUrl } from 'src/hooks/use-explorer-url';
import { useAppSelector } from 'src/redux-slices/hook';
import { formatAddress } from 'src/services';
import { useWalletAction } from 'src/wallet-connection/wallet-action';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ConnectedDialog({ open, onClose }: Props) {
  const { disconnect } = useWalletAction();
  const { connector, chainId } = useAppSelector((state) => state.config);
  const { eoaAddress } = useAppSelector((state) => state.user);
  const { link } = useExplorerUrl(eoaAddress, { chainId, type: 'address' });

  function onDisconnect() {
    disconnect();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ background: '#F2F5FA', p: '1rem', pt: '1.5rem', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">Wallet connection</Typography>
          <IconButton onClick={() => onClose()}>
            <Close sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {connector && <Typography>{`Connected with ${CONNECTORS[connector].name}`}</Typography>}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 3,
            mb: 3,
            justifyContent: 'space-between',
          }}
        >
          <Typography>{formatAddress(eoaAddress, 6)}</Typography>
          <CopyIcon
            copyText={eoaAddress}
            iconProps={{ sx: { fontSize: '16px', color: 'primary.main' } }}
          />
        </Box>
        <Box sx={{ alignItems: 'center' }}>
          <Link
            href={link}
            target="_blank"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <Typography>View on Explorer</Typography>
            <Launch sx={{ fontSize: '16px', color: 'primary.main', ml: 0.5 }} />
          </Link>
          <Button variant="outlined" sx={{ width: '100%', mt: 3 }} onClick={onDisconnect}>
            Disconnect
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
