import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LS } from 'src/configs/constance';
import { AllowedNetwork } from 'src/configs/network-config';
import { ConnectorType, ThemeMode, WalletType } from 'src/global';
import LocalStorage from 'src/local-storage-connection/local-storage';

export interface ConfigSliceType {
  chainId: number;
  connector: ConnectorType | null;
  themeMode: ThemeMode;
  walletType: WalletType | null;
}

const initialState: ConfigSliceType = {
  chainId: -1,
  connector: null,
  themeMode: 'light',
  walletType: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    initLocalStorage: (
      state: ConfigSliceType,
      actions: PayloadAction<Partial<Omit<ConfigSliceType, 'chainId' | 'connector'>>>
    ) => {
      const { themeMode, walletType } = actions.payload;
      if (themeMode) state.themeMode = themeMode;
      if (walletType) state.walletType = walletType;
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
    changeWalletType: (
      state: ConfigSliceType,
      actions: PayloadAction<{ walletType: WalletType } | undefined>
    ) => {
      if (actions.payload) {
        const { walletType } = actions.payload;
        state.walletType = walletType;
        LocalStorage.set(LS.WALLET_TYPE, walletType);
      } else {
        state.walletType = null;
        LocalStorage.remove(LS.WALLET_TYPE);
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
export const { initLocalStorage, switchTheme, changeWalletType, setNetworkConfig, resetConfig } =
  configSlice.actions;
