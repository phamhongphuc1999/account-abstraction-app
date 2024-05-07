import { useCallback, useEffect } from 'react';
import { CHAINS } from 'src/configs/network-config';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/hook';
import { updateBalance } from 'src/redux-slices/token-slice';
import BalanceService from 'src/services/balance-service';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

export default function AppEffect() {
  const { reader } = usRpcProviderContext();
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector((state) => state.config);
  const { accountAddress } = useAppSelector((state) => state.user);

  const _fetchNativeBalance = useCallback(async () => {
    if (reader && chainId > 0) {
      const chainConfig = CHAINS[chainId];
      const nativeToken = chainConfig.nativeCurrency.decimals;
      const _balance = await BalanceService.native(reader, accountAddress, nativeToken);
      dispatch(updateBalance(_balance));
    }
  }, [accountAddress, chainId, reader, dispatch]);

  useEffect(() => {
    _fetchNativeBalance();
  }, [_fetchNativeBalance]);

  return <></>;
}
