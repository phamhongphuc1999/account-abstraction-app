import { createConfig, http, injected } from '@wagmi/core';
import { useCallback } from 'react';
import { AllowedNetwork } from 'src/configs/network-config';
import { ConnectorType } from 'src/global';
import { defineChain } from 'viem';
import { CreateConnectorFn, useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

const localhost = /*#__PURE__*/ defineChain({
  id: 31337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
});

export const connectorFns: { [id in ConnectorType]: CreateConnectorFn } = {
  metamask: injected({ target: 'metaMask' }),
  coinbase: coinbaseWallet({ appName: 'My App', appLogoUrl: '' }),
};

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet, localhost],
  connectors: [connectorFns.metamask, connectorFns.coinbase],
  transports: { [bsc.id]: http(), [bscTestnet.id]: http(), [localhost.id]: http() },
});

export function useWalletAction() {
  const { switchChainAsync } = useSwitchChain();
  const { connect } = useConnect();
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const _switch = useCallback(
    async (chainId: number) => {
      if (chainId == account.chain?.id) return { chain: undefined, status: 'success', error: '' };
      try {
        const chain = await switchChainAsync({ chainId });
        return { chain, status: 'success', error: '' };
      } catch (error) {
        return { chain: undefined, status: 'fail', error: String(error) };
      }
    },
    [switchChainAsync, account.chain]
  );

  const _connect = useCallback(
    async (connector: ConnectorType, chainId = -1) => {
      if (!account.isConnected) {
        if (AllowedNetwork.includes(chainId))
          connect({ connector: connectorFns[connector], chainId });
        else connect({ connector: connectorFns[connector] });
      }
    },
    [account.isConnected, connect]
  );

  const _disconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return { switchNetwork: _switch, connect: _connect, disconnect: _disconnect };
}
