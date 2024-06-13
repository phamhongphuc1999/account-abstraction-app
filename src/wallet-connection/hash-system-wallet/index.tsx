import { ReactNode } from 'react';
import HashWalletProvider from './hash-wallet-context';

interface Props {
  children: ReactNode;
}

export default function HashSystemConnection({ children }: Props) {
  return <HashWalletProvider>{children}</HashWalletProvider>;
}
