import { ContractTransactionResponse } from 'ethers';
import { AppDispatch } from 'src/redux-slices/store';
import { popTxStatus, pushTxStatus, updateTxStatus } from 'src/redux-slices/tx-status-slice';

export default class HandleEmit {
  static createEmit(dispatch: AppDispatch, title: string) {
    const id = dispatch(pushTxStatus({ title, status: 'WAIT_CONFIRM' }));
    return id;
  }

  static async handleEmit(
    dispatch: AppDispatch,
    response: ContractTransactionResponse,
    id: string
  ) {
    dispatch(updateTxStatus({ id, status: 'EXECUTING' }));
    const receipt = await response.wait();
    dispatch(
      updateTxStatus({
        id,
        status: receipt?.status === 0 ? 'FAIL' : 'SUCCESS',
        hash: receipt?.hash,
      })
    );
    setTimeout(() => {
      dispatch(popTxStatus({ id }));
    }, 10000);
  }

  static detectEmitError(dispatch: AppDispatch, id: string, error: string) {
    dispatch(updateTxStatus({ id, status: 'FAIL', error }));
    setTimeout(() => {
      dispatch(popTxStatus({ id }));
    }, 10000);
  }
}
