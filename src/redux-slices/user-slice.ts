import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FStatus } from 'src/global';

export interface UserSliceType {
  eoaAddress: string;
  connectionStatus: FStatus;
}

const initialState: UserSliceType = {
  eoaAddress: '',
  connectionStatus: 'INITIAL',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    updateAccountConfig: (state: UserSliceType, actions: PayloadAction<Partial<UserSliceType>>) => {
      const { eoaAddress, connectionStatus } = actions.payload;
      if (eoaAddress != undefined) state.eoaAddress = eoaAddress.toLowerCase();
      if (connectionStatus != undefined) state.connectionStatus = connectionStatus;
    },
    resetUser: (state: UserSliceType) => {
      state.eoaAddress = '';
      state.connectionStatus = 'INITIAL';
    },
  },
});

export default userSlice.reducer;
export const { updateAccountConfig, resetUser } = userSlice.actions;
