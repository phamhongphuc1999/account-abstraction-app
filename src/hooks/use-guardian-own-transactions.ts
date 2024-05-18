import { useCallback } from 'react';
import { useGuardianContract } from 'src/contracts/hash-guardian-contract';
import { HashGuardianAbi__factory } from 'src/contracts/typechain';
import { GuardianOwnTransactionType, MultiCallType } from 'src/global';
import { updateGuardianOwnTransactions } from 'src/redux-slices/guardian-slice';
import { useAppDispatch, useAppSelector } from 'src/redux-slices/hook';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import useMultiCall from './use-multi-call';

export default function useGuardianOwnTransactions() {
  const { guardianAddress, config } = useAppSelector((state) => state.guardian);
  const dispatch = useAppDispatch();
  const { ownerTransactionCount } = config;
  const { reader } = usRpcProviderContext();
  const guardianContract = useGuardianContract(guardianAddress);
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
        for (const item of result) {
          const _calldata = item[1];
          _data[String(_calldata)] = {
            value: parseInt(item[0]),
            data: _calldata,
            eta: parseInt(item[2]),
            executedType: parseInt(item[3]),
            type: parseInt(item[4]),
          };
        }
        dispatch(updateGuardianOwnTransactions(_data));
      }
    }
  }, [guardianContract, ownerTransactionCount, reader, multiCallFn, dispatch]);

  return { fetchOwnTransaction: _fetchOwnTransaction };
}
