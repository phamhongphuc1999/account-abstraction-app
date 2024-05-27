/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interface, isAddress } from 'ethers';
import { useCallback } from 'react';
import MultiCallContract from 'src/contracts/multi-call-contract';
import { MultiCallParams } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';
import StaticQuery from '../services/static-query';

export function multiCallFactory(chainId: number) {
  const { MULTI_CALL_ADDRESS } = StaticQuery.getAddresses(chainId);
  if (isAddress(MULTI_CALL_ADDRESS)) {
    return async ({ abi, calls, reader }: MultiCallParams) => {
      const _contract = new MultiCallContract(reader, MULTI_CALL_ADDRESS);
      const _interface = new Interface(abi);
      const callData = calls.map((call) => ({
        target: call.address.toLowerCase(),
        callData: _interface.encodeFunctionData(call.name, call.params),
      }));
      const { returnData } = await _contract.fn.aggregate(callData);
      return returnData.map((call: any, i: any) =>
        _interface.decodeFunctionResult(calls[i].name, call)
      );
    };
  }
}

export default function useMultiCall() {
  const { chainId } = useAppSelector((state) => state.config);

  const _fn = useCallback(
    async (params: MultiCallParams) => {
      const _multiCallFn = multiCallFactory(chainId);
      if (_multiCallFn) return await _multiCallFn(params);
    },
    [chainId]
  );

  return { multiCallFn: _fn };
}
