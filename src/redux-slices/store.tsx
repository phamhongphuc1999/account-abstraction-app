import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import configSlice from './config-slice';
import guardianSlice from './guardian-slice';
import tokenSlice from './token-slice';
import txStatusSlice from './tx-status-slice';
import userSlice from './user-slice';

const store = configureStore({
  reducer: {
    user: userSlice,
    config: configSlice,
    token: tokenSlice,
    guardian: guardianSlice,
    txStatus: txStatusSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
