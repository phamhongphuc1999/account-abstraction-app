import { configureStore } from '@reduxjs/toolkit';
import configSlice from './config-slice';
import guardianSlice from './guardian-slice';
import tokenSlice from './token-slice';
import userSlice from './user-slice';

const store = configureStore({
  reducer: { user: userSlice, config: configSlice, token: tokenSlice, guardian: guardianSlice },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
