import { WalletKeyType } from 'src/global';
import HashSystemButton from './hash-system-button';
import WagmiNetworkButton from './wagmi-network-button';
import { ButtonProps } from '@mui/material';

interface Props {
  mode: WalletKeyType;
  props?: ButtonProps;
}

export default function NetworkButton({ mode, props }: Props) {
  return mode == 'wagmi' ? (
    <WagmiNetworkButton props={props} />
  ) : (
    <HashSystemButton props={props} />
  );
}
