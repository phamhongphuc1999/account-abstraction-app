/* eslint-disable @typescript-eslint/no-use-before-define */
import { PayloadAction, createDraftSafeSelector, createSlice, nanoid } from '@reduxjs/toolkit';
import { FStatus } from 'src/global';
import { AppDispatch, RootState } from './store';

export interface TxStatusObject {
  id: string;
  title: string;
  status: FStatus;
  hash?: string;
  error?: string;
}

export interface TxStatusSliceType {
  data: { [key: string]: TxStatusObject };
}

const initialState: TxStatusSliceType = {
  data: {},
};

export function pushTxStatus(txData: Omit<TxStatusObject, 'id'>) {
  return (dispatch: AppDispatch, _: () => RootState) => {
    const id = nanoid();
    dispatch(txStatusSlice.actions.pushTxStatusSuccess({ id, ...txData }));
    return id;
  };
}

const txStatusSlice = createSlice({
  name: 'txStatusSlice',
  initialState,
  reducers: {
    pushTxStatusSuccess: (state: TxStatusSliceType, actions: PayloadAction<TxStatusObject>) => {
      const txData = actions.payload;
      const id = txData.id;
      state.data[id] = txData;
    },
    popTxStatus: (state: TxStatusSliceType, actions: PayloadAction<{ id: string }>) => {
      const id = actions.payload.id;
      if (state.data[id]) delete state.data[id];
    },
    updateTxStatus: (
      state: TxStatusSliceType,
      actions: PayloadAction<Partial<TxStatusObject> & { id: string }>
    ) => {
      const txData = actions.payload;
      const id = txData.id;
      const oldData = state.data[id];
      if (oldData) state.data[id] = { ...oldData, ...txData };
    },
  },
});

export default txStatusSlice.reducer;
export const { popTxStatus, updateTxStatus } = txStatusSlice.actions;

export const getTxStatus = createDraftSafeSelector(
  [(state: TxStatusSliceType) => state.data],
  (data: { [key: string]: TxStatusObject }) => {
    const result = Object.values(data);
    if (result.length == 0) return null;
    else return result;
  }
);
