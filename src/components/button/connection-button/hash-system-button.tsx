import { Button, ButtonProps } from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import { ConnectedWalletIcon, DisconnectedWalletIcon } from 'src/components/icons';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';
import ConnectedDialog from './connected-dialog';
import ConnectionDialog from './connection-dialog';

interface Props {
  props?: ButtonProps;
}

export default function HashSystemButton({ props }: Props) {
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [connectedOpen, setConnectedOpen] = useState(false);
  const { ownerAddress } = useAppSelector((state) => state.user);
  const { walletType } = useAppSelector((state) => state.config);

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
        {ownerAddress.length > 0
          ? `${formatAddress(ownerAddress, 4)}(${walletType})`
          : 'Connect Wallet'}
      </Button>
      <ConnectionDialog open={connectionOpen} onClose={() => setConnectionOpen(false)} />
      <ConnectedDialog open={connectedOpen} onClose={() => setConnectedOpen(false)} />
    </>
  );
}
