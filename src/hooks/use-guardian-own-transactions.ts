import { useCallback } from 'react';
import { useHashGuardianContract } from 'src/contracts/hash-guardian-contract';
import { HashGuardianAbi__factory } from 'src/contracts/typechain';
import { GuardianOwnTransactionType, MultiCallType } from 'src/global';
import { updateGuardianOwnTransactions } from 'src/redux-slices/guardian-slice';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/hook';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import useMultiCall from './use-multi-call';

export default function useGuardianOwnTransactions() {
  const { config } = useAppSelector((state) => state.guardian);
  const { ownerTransactionCount } = config;
  const dispatch = useAppDispatch();
  const { reader } = usRpcProviderContext();
  const guardianContract = useHashGuardianContract();
  const { multiCallFn } = useMultiCall();

  const _fetchOwnTransaction = useCallback(async () => {
    if (guardianContract && ownerTransactionCount > 0 && reader) {
      const calls: Array<MultiCallType> = [];
      let counter = 0;
      while (counter < ownerTransactionCount) {
        calls.push({
          address: guardianContract.address,
          name: 'ownerTransactions',
          params: [counter],
        });
        counter++;
      }
      const result = await multiCallFn({ abi: HashGuardianAbi__factory.abi, calls, reader });
      if (result) {
        const _data: { [data: string]: GuardianOwnTransactionType } = {};
        counter = 0;
        for (const item of result) {
          const _calldata = item[1];
          _data[String(_calldata)] = {
            index: counter,
            value: parseInt(item[0]),
            data: _calldata,
            eta: parseInt(item[2]),
            executedType: parseInt(item[3]),
            type: parseInt(item[4]),
          };
          counter++;
        }
        dispatch(updateGuardianOwnTransactions(_data));
      }
    }
  }, [guardianContract, ownerTransactionCount, reader, multiCallFn, dispatch]);

  return { fetchOwnTransaction: _fetchOwnTransaction };
}
