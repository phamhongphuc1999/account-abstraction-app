import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeployStatus } from 'src/global';

export interface GuardianSliceType {
  guardianAddress: string;
  deployType: DeployStatus | 'notConfig';
  config: {
    threshold: number;
    guardianCount: number;
    delay: number;
    expirePeriod: number;
    ownerTransactionCount: number;
  };
}

const initialState: GuardianSliceType = {
  guardianAddress: '',
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
      actions: PayloadAction<{ guardianAddress: string; deployType: DeployStatus | 'notConfig' }>
    ) => {
      const { guardianAddress, deployType } = actions.payload;
      state.guardianAddress = guardianAddress;
      state.deployType = deployType;
    },
    updateGuardianConfig: (
      state: GuardianSliceType,
      actions: PayloadAction<
        Partial<GuardianSliceType['config'] & { deployType: DeployStatus | 'notConfig' }>
      >
    ) => {
      const { threshold, guardianCount, delay, expirePeriod, ownerTransactionCount, deployType } =
        actions.payload;
      if (threshold) state.config.threshold = threshold;
      if (guardianCount) state.config.guardianCount = guardianCount;
      if (delay) state.config.delay = delay;
      if (expirePeriod) state.config.expirePeriod = expirePeriod;
      if (ownerTransactionCount) state.config.ownerTransactionCount = ownerTransactionCount;
      if (deployType) state.deployType = deployType;
    },
  },
});

export default guardianSlice.reducer;
export const { setGuardianAddress, updateGuardianConfig } = guardianSlice.actions;
