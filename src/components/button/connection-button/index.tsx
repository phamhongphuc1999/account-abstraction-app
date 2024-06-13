import { WalletKeyType } from 'src/global';
import HashSystemButton from './hash-system-button';
import WagmiButton from './wagmi-button';

interface Props {
  mode: WalletKeyType;
}

export default function ConnectionButton({ mode }: Props) {
  return mode == 'wagmi' ? <WagmiButton /> : <HashSystemButton />;
}
