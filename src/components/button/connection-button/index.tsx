import { Button, ButtonProps } from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import { ConnectedWalletIcon, DisconnectedWalletIcon } from 'src/components/icons';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';
import { useWalletAction } from 'src/wallet-connection/wallet-action';
import ConnectedDialog from './connected-dialog';
import ConnectionDialog from './connection-dialog';

interface Props {
  props?: ButtonProps;
}

export default function ConnectionButton({ props }: Props) {
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [connectedOpen, setConnectedOpen] = useState(false);
  const { ownerAddress } = useAppSelector((state) => state.user);
  const { connect, disconnect } = useWalletAction();

  function onClick() {
    if (isAddress(ownerAddress)) setConnectedOpen(true);
    else setConnectionOpen(true);
  }

  return (
    <>
      <Button
        {...props}
        variant="contained"
        color="primary"
        onClick={onClick}
        startIcon={ownerAddress ? <ConnectedWalletIcon /> : <DisconnectedWalletIcon />}
      >
        {ownerAddress.length > 0 ? formatAddress(ownerAddress, 4) : 'Connect Wallet'}
      </Button>
      <ConnectionDialog
        open={connectionOpen}
        connect={connect}
        onClose={() => setConnectionOpen(false)}
      />
      <ConnectedDialog
        open={connectedOpen}
        disconnect={disconnect}
        onClose={() => setConnectedOpen(false)}
      />
    </>
  );
}
