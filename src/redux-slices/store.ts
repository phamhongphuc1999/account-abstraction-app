import { configureStore } from '@reduxjs/toolkit';
import configSlice from './config-slice';
import userSlice from './user-slice';

const store = configureStore({
  reducer: { user: userSlice, config: configSlice },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
