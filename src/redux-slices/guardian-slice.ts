import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, merge } from 'lodash';
import { DeployStatus } from 'src/global';

export interface GuardianSliceType {
  guardianAddress: string;
  deployType: DeployStatus;
  configType: 'initial' | 'notConfig' | 'alreadyConfig';
  config: {
    threshold: number;
    guardianCount: number;
    delay: number;
    expirePeriod: number;
    ownerTransactionCount: number;
    hashList: Array<string>;
  };
}

const initialState: GuardianSliceType = {
  guardianAddress: '',
  deployType: 'initial',
  configType: 'initial',
  config: {
    threshold: 0,
    guardianCount: 0,
    delay: 0,
    expirePeriod: 0,
    ownerTransactionCount: 0,
    hashList: [],
  },
};

const guardianSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setGuardianAddress: (
      state: GuardianSliceType,
      actions: PayloadAction<{ guardianAddress: string; deployType: DeployStatus }>
    ) => {
      const { guardianAddress, deployType } = actions.payload;
      state.guardianAddress = guardianAddress.toLowerCase();
      state.deployType = deployType;
    },
    updateGuardianConfig: (
      state: GuardianSliceType,
      actions: PayloadAction<
        Partial<
          GuardianSliceType['config'] & { configType: 'initial' | 'notConfig' | 'alreadyConfig' }
        >
      >
    ) => {
      const { configType } = actions.payload;
      if (configType) state.configType = configType;
      const _config = cloneDeep(actions.payload);
      delete _config['configType'];
      state.config = merge(state.config, _config);
    },
  },
});

export default guardianSlice.reducer;
export const { setGuardianAddress, updateGuardianConfig } = guardianSlice.actions;
