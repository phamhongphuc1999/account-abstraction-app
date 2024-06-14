import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LS } from 'src/configs/constance';
import { AllowedNetwork } from 'src/configs/network-config';
import { ConnectorType, ThemeMode } from 'src/global';
import LocalStorage from 'src/local-storage-connection/local-storage';

export interface ConfigSliceType {
  chainId: number;
  connector: ConnectorType | null;
  themeMode: ThemeMode;
}

const initialState: ConfigSliceType = {
  chainId: -1,
  connector: null,
  themeMode: 'light',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    initLocalStorage: (
      state: ConfigSliceType,
      actions: PayloadAction<Partial<Omit<ConfigSliceType, 'chainId' | 'connector'>>>
    ) => {
      const { themeMode } = actions.payload;
      if (themeMode) state.themeMode = themeMode;
    },
    switchTheme: (
      state: ConfigSliceType,
      actions: PayloadAction<{ themeMode: ThemeMode } | undefined>
    ) => {
      if (actions.payload) {
        const { themeMode } = actions.payload;
        state.themeMode = themeMode;
        LocalStorage.set(LS.THEME, themeMode);
      } else {
        const newTheme = state.themeMode == 'light' ? 'dark' : 'light';
        state.themeMode = newTheme;
        LocalStorage.set(LS.THEME, newTheme);
      }
    },
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
export const { initLocalStorage, switchTheme, setNetworkConfig, resetConfig } = configSlice.actions;
