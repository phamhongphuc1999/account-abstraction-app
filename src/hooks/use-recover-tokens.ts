import { isAddress } from 'ethers';
import { useCallback } from 'react';
import { CHAINS } from 'src/configs/network-config';
import { AccountType, StandardToken, StringListType } from 'src/global';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/store';
import { setTokens, updateBalance, updateNormalBalance } from 'src/redux-slices/token-slice';
import BalanceService from 'src/services/balance-service';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

export default function useRecoverTokens() {
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector((state) => state.config);
  const { reader } = usRpcProviderContext();
  const { indexedStorage } = useLocalStorageContext();

  const _recoverTokens = useCallback(
    async (accountAddress: string, type: AccountType) => {
      if (indexedStorage && reader && isAddress(accountAddress)) {
        const tokens = await indexedStorage.token.getAll();
        const result: StringListType<StandardToken & { balance: string }> = {};
        for (const token of tokens) {
          const _balance = await BalanceService.normal(reader, accountAddress, token);
          result[token.address] = { ...token, balance: _balance };
        }
        dispatch(setTokens({ tokens: result, type }));
      }
    },
    [indexedStorage, reader, dispatch]
  );

  const _fetchNativeBalance = useCallback(
    async (accountAddress: string, type: AccountType) => {
      if (reader && chainId > 0 && isAddress(accountAddress)) {
        const chainConfig = CHAINS[chainId];
        const nativeToken = chainConfig.nativeCurrency.decimals;
        const _balance = await BalanceService.native(reader, accountAddress, nativeToken);
        dispatch(updateBalance({ balance: _balance, type }));
      }
    },
    [chainId, reader, dispatch]
  );

  const _fetchNormalBalance = useCallback(
    async (accountAddress: string, token: StandardToken, type: AccountType) => {
      if (reader && isAddress(accountAddress)) {
        const _balance = await BalanceService.normal(reader, accountAddress, token);
        dispatch(updateNormalBalance({ tokenAddress: token.address, balance: _balance, type }));
      }
    },
    [dispatch, reader]
  );

  return {
    recoverTokens: _recoverTokens,
    fetchNativeBalance: _fetchNativeBalance,
    fetchNormalBalance: _fetchNormalBalance,
  };
}
