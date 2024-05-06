/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserProvider } from 'ethers';
import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CHAINS } from 'src/configs/network-config';
import { resetConfig, setNetworkConfig } from 'src/redux-slices/config-slice';
import { useAppDispatch } from 'src/redux-slices/hook';
import { resetUser, updateAccountConfig } from 'src/redux-slices/user-slice';
import { useAccount, useConnect } from 'wagmi';
import { usRpcProviderContext } from './rpc-provider-context';

export default function WalletEffect() {
  const dispatch = useAppDispatch();
  const account = useAccount();
  const { error } = useConnect();
  const { setReader, setSigner } = usRpcProviderContext();

  const _setReader = useCallback(
    async (chainId: number) => {
      const _config = CHAINS[chainId];
      await setReader(_config.urls);
    },
    [setReader]
  );

  const _updateAccount = useCallback(
    async (chainId: number) => {
      if (account.isConnected && account.connector?.getProvider) {
        if (typeof account.connector.getProvider == 'function') {
          await _setReader(chainId);
          const provider = new BrowserProvider((await account.connector.getProvider()) as any);
          setSigner(await provider.getSigner());
        }
      }
    },
    [account.isConnected, account.connector?.getProvider]
  );

  // switch chain event
  useEffect(() => {
    if (account.chainId && account.isConnected) {
      _updateAccount(account.chainId);
      dispatch(setNetworkConfig({ chainId: account.chainId }));
    }
  }, [account.chainId, account.isConnected, _updateAccount]);

  // switch account event
  useEffect(() => {
    if (account.address) {
      dispatch(updateAccountConfig({ eoaAddress: account.address }));
    }
  }, [account.address]);

  // disconnect
  useEffect(() => {
    if (account.isDisconnected) {
      dispatch(resetUser());
      dispatch(resetConfig());
    }
  }, [account.isDisconnected]);

  // detect errors
  useEffect(() => {
    if (error) {
      toast.error(error.message);
      console.error(error);
    }
  }, [error]);

  return <></>;
}
