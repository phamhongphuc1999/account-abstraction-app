import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeployStatus, FStatus } from 'src/global';

export interface UserSliceType {
  ownerAddress: string;
  accountAddress: string;
  deployType: DeployStatus;
  connectionStatus: FStatus;
}

const initialState: UserSliceType = {
  ownerAddress: '',
  accountAddress: '',
  deployType: 'initial',
  connectionStatus: 'INITIAL',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    updateAccountConfig: (state: UserSliceType, actions: PayloadAction<Partial<UserSliceType>>) => {
      const { ownerAddress, accountAddress, deployType, connectionStatus } = actions.payload;
      if (ownerAddress != undefined) state.ownerAddress = ownerAddress.toLowerCase();
      if (accountAddress != undefined) state.accountAddress = accountAddress.toLowerCase();
      if (deployType != undefined) state.deployType = deployType;
      if (connectionStatus != undefined) state.connectionStatus = connectionStatus;
    },
    resetUser: (state: UserSliceType) => {
      state.ownerAddress = '';
      state.accountAddress = '';
      state.deployType = 'initial';
      state.connectionStatus = 'INITIAL';
    },
  },
});

export default userSlice.reducer;
export const { updateAccountConfig, resetUser } = userSlice.actions;
