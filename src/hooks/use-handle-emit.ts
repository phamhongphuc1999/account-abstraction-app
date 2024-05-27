import { ContractTransactionResponse } from 'ethers';
import { useCallback } from 'react';
import { useAppDispatch } from 'src/redux-slices/store';
import HandleEmit from 'src/services/handle-emit';

export default function useHandleEmit() {
  const dispatch = useAppDispatch();

  const createEmit = useCallback(
    (title: string) => {
      return HandleEmit.createEmit(dispatch, title);
    },
    [dispatch]
  );

  const handleEmit = useCallback(
    async (response: ContractTransactionResponse, id: string) => {
      return HandleEmit.handleEmit(dispatch, response, id);
    },
    [dispatch]
  );

  const detectEmitError = useCallback(
    (id: string, error: string) => {
      return HandleEmit.detectEmitError(dispatch, id, error);
    },
    [dispatch]
  );

  return { createEmit, handleEmit, detectEmitError };
}
