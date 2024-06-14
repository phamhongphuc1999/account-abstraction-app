import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import ExploreIcon from 'src/components/icons/explore-icon';
import { CONNECTORS } from 'src/configs/network-config';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';

interface Props {
  open: boolean;
  disconnect?: () => void;
  onClose: () => void;
}

export default function ConnectedDialog({ open, disconnect, onClose }: Props) {
  const theme = useTheme();
  const { connector } = useAppSelector((state) => state.config);
  const { ownerAddress, accountAddress, deployType } = useAppSelector((state) => state.user);
  const { guardianAddress } = useAppSelector((state) => state.guardian);

  const deployText = useMemo(() => {
    // eslint-disable-next-line quotes
    if (deployType == 'notDeploy') return "haven't deployed";
    else if (deployType == 'deployed') return 'deployed';
    else return '';
  }, [deployType]);

  function onDisconnect() {
    if (disconnect) disconnect();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ background: theme.palette.background.paper, alignItems: 'center' }}>
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
        <ExploreIcon hash={ownerAddress} />
        <Typography sx={{ mt: 2 }} variant="subtitle1">
          {`Account(${deployText})`}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{formatAddress(accountAddress, 6)}</Typography>
          <CopyIcon
            copyText={accountAddress}
            iconProps={{ sx: { fontSize: '16px', color: 'primary.main' } }}
          />
        </Box>
        <ExploreIcon hash={accountAddress} />
        {guardianAddress && (
          <>
            <Typography sx={{ mt: 2 }} variant="subtitle1">
              Guardian
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>{formatAddress(guardianAddress, 6)}</Typography>
              <CopyIcon
                copyText={guardianAddress}
                iconProps={{ sx: { fontSize: '16px', color: 'primary.main' } }}
              />
            </Box>
            <ExploreIcon hash={guardianAddress} />
          </>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" sx={{ width: '100%' }} onClick={onDisconnect}>
            Disconnect
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
