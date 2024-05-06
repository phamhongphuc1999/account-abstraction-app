/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserProvider } from 'ethers';
import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { SIMPLE_SALT } from 'src/configs/constances';
import { CHAINS } from 'src/configs/network-config';
import { useAccountFactoryContract } from 'src/contracts/account-factory-contract';
import { resetConfig, setNetworkConfig } from 'src/redux-slices/config-slice';
import { useAppDispatch } from 'src/redux-slices/hook';
import { resetUser, updateAccountConfig } from 'src/redux-slices/user-slice';
import { useAccount, useConnect } from 'wagmi';
import { usRpcProviderContext } from './rpc-provider-context';

export default function WalletEffect() {
  const dispatch = useAppDispatch();
  const account = useAccount();
  const { error } = useConnect();
  const { reader, setReader, setSigner } = usRpcProviderContext();
  const factoryContract = useAccountFactoryContract();

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
    [account.isConnected, account.connector]
  );

  // switch chain event
  useEffect(() => {
    if (account.chainId && account.isConnected) {
      _updateAccount(account.chainId);
      dispatch(setNetworkConfig({ chainId: account.chainId }));
    }
  }, [account.chainId, account.isConnected, _updateAccount]);

  // switch account event
  const _switch = useCallback(async () => {
    if (account.address) {
      let accountAddress: string | undefined = undefined;
      let deployType: 'deployed' | 'notDeploy' | undefined = undefined;
      if (factoryContract && reader) {
        accountAddress = await factoryContract.getAddress(account.address, SIMPLE_SALT);
        const _code = await reader.getCode(accountAddress);
        if (_code != '0x') deployType = 'deployed';
        else deployType = 'notDeploy';
      }
      dispatch(updateAccountConfig({ ownerAddress: account.address, accountAddress, deployType }));
    }
  }, [account.address, factoryContract, reader]);
  useEffect(() => {
    _switch();
  }, [_switch]);

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
