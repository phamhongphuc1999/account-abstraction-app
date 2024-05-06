import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CopyIcon from 'src/components/icons/copy-icon';
import ExploreIcon from 'src/components/icons/explore-icon';
import { CONNECTORS } from 'src/configs/network-config';
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
  const { ownerAddress, accountAddress } = useAppSelector((state) => state.user);

  function onDisconnect() {
    disconnect();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ background: '#002753', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Wallet connection</Typography>
          <IconButton onClick={() => onClose()}>
            <Close sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {connector && <Typography>{`Connected with ${CONNECTORS[connector].name}`}</Typography>}
        <Typography sx={{ mt: 2 }} variant="subtitle1">
          Owner
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{formatAddress(ownerAddress, 6)}</Typography>
          <CopyIcon
            copyText={ownerAddress}
            iconProps={{ sx: { fontSize: '16px', color: 'primary.main' } }}
          />
        </Box>
        <ExploreIcon hash={ownerAddress} config={{ chainId, type: 'address' }} />
        <Typography sx={{ mt: 2 }} variant="subtitle1">
          Account
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{formatAddress(accountAddress, 6)}</Typography>
          <CopyIcon
            copyText={accountAddress}
            iconProps={{ sx: { fontSize: '16px', color: 'primary.main' } }}
          />
        </Box>
        <ExploreIcon hash={accountAddress} config={{ chainId, type: 'address' }} />
        <Button variant="outlined" sx={{ width: '100%', mt: 3 }} onClick={onDisconnect}>
          Disconnect
        </Button>
      </DialogContent>
    </Dialog>
  );
}
