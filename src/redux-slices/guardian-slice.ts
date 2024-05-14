import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeployStatus } from 'src/global';

export interface GuardianSliceType {
  address: string;
  deployType: DeployStatus;
  config: {
    threshold: number;
    guardianCount: number;
    delay: number;
    expirePeriod: number;
    ownerTransactionCount: number;
  };
}

const initialState: GuardianSliceType = {
  address: '',
  deployType: 'initial',
  config: {
    threshold: 0,
    guardianCount: 0,
    delay: 0,
    expirePeriod: 0,
    ownerTransactionCount: 0,
  },
};

const guardianSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setGuardianAddress: (
      state: GuardianSliceType,
      actions: PayloadAction<{ address: string; deployType: DeployStatus }>
    ) => {
      const { address, deployType } = actions.payload;
      state.address = address;
      state.deployType = deployType;
    },
    updateGuardianConfig: (
      state: GuardianSliceType,
      actions: PayloadAction<Partial<GuardianSliceType['config']>>
    ) => {
      const { threshold, guardianCount, delay, expirePeriod, ownerTransactionCount } =
        actions.payload;
      if (threshold) state.config.threshold = threshold;
      if (guardianCount) state.config.guardianCount = guardianCount;
      if (delay) state.config.delay = delay;
      if (expirePeriod) state.config.expirePeriod = expirePeriod;
      if (ownerTransactionCount) state.config.ownerTransactionCount = ownerTransactionCount;
    },
  },
});

export default guardianSlice.reducer;
export const { setGuardianAddress, updateGuardianConfig } = guardianSlice.actions;
