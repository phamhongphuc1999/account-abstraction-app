import { Button, ButtonProps } from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import { ConnectedWalletIcon, DisconnectedWalletIcon } from 'src/components/icons';
import { useAppSelector } from 'src/redux-slices/hook';
import { formatAddress } from 'src/services';
import ConnectedDialog from './connected-dialog';
import ConnectionDialog from './connection-dialog';

interface Props {
  props?: ButtonProps;
}

export default function ConnectionButton({ props }: Props) {
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [connectedOpen, setConnectedOpen] = useState(false);
  const { eoaAddress } = useAppSelector((state) => state.user);

  function onClick() {
    if (isAddress(eoaAddress)) setConnectedOpen(true);
    else setConnectionOpen(true);
  }

  return (
    <>
      <Button
        {...props}
        variant="contained"
        color="primary"
        onClick={onClick}
        startIcon={eoaAddress ? <ConnectedWalletIcon /> : <DisconnectedWalletIcon />}
      >
        {eoaAddress.length > 0 ? formatAddress(eoaAddress, 4) : 'Connect Wallet'}
      </Button>
      <ConnectionDialog open={connectionOpen} onClose={() => setConnectionOpen(false)} />
      <ConnectedDialog open={connectedOpen} onClose={() => setConnectedOpen(false)} />
    </>
  );
}
