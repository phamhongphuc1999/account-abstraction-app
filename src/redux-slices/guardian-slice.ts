import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { cloneDeep, merge } from 'lodash';
import { DeployStatus, GuardianOwnTransactionType } from 'src/global';

export interface GuardianSliceType {
  guardianAddress: string;
  ownTransactions: { [data: string]: GuardianOwnTransactionType };
  config: {
    threshold: number;
    guardianCount: number;
    maxGuardians: number;
    delay: number;
    expirePeriod: number;
    ownerTransactionCount: number;
    hashList: Array<string>;
  };
  deployType: DeployStatus;
  configType: 'initial' | 'notConfig' | 'alreadyConfig';
}

const initialState: GuardianSliceType = {
  guardianAddress: '',
  ownTransactions: {},
  config: {
    threshold: 0,
    guardianCount: 0,
    maxGuardians: 0,
    delay: 0,
    expirePeriod: 0,
    ownerTransactionCount: 0,
    hashList: [],
  },
  deployType: 'initial',
  configType: 'initial',
};

const guardianSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateGuardianOwnTransactions: (
      state: GuardianSliceType,
      actions: PayloadAction<{ [data: string]: GuardianOwnTransactionType }>
    ) => {
      state.ownTransactions = actions.payload;
    },
    updateGuardianOwnTransaction: (
      state: GuardianSliceType,
      actions: PayloadAction<GuardianOwnTransactionType>
    ) => {
      const _data = actions.payload;
      state.ownTransactions[_data.data] = _data;
    },
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
export const {
  updateGuardianOwnTransactions,
  updateGuardianOwnTransaction,
  setGuardianAddress,
  updateGuardianConfig,
} = guardianSlice.actions;
