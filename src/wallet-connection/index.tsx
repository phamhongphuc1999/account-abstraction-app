import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import RpcProviderProvider from './rpc-provider-context';
import { wagmiConfig } from './wallet-action';
import WalletEffect from './wallet-effect';

interface Props {
  children: ReactNode;
}

export default function WalletConnection({ children }: Props) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RpcProviderProvider>
          <WalletEffect />
          {children}
        </RpcProviderProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
