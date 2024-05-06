import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AllowedNetwork } from 'src/configs/network-config';
import { ConnectorType } from 'src/global';

export interface ConfigSliceType {
  chainId: number;
  connector: ConnectorType | null;
}

const initialState: ConfigSliceType = {
  chainId: -1,
  connector: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setNetworkConfig: (
      state: ConfigSliceType,
      actions: PayloadAction<{ chainId: number; connector?: ConnectorType }>
    ) => {
      const { chainId, connector } = actions.payload;
      if (AllowedNetwork.includes(chainId)) state.chainId = chainId;
      if (connector) state.connector = connector;
    },
    resetConfig: (state: ConfigSliceType) => {
      state.chainId = -1;
      state.connector = null;
    },
  },
});

export default configSlice.reducer;
export const { setNetworkConfig, resetConfig } = configSlice.actions;
