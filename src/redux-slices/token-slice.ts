import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StandardToken, StringListType } from 'src/global';

export interface TokenSliceType {
  balance: string;
  tokens: StringListType<StandardToken & { balance: string }>;
}

const initialState: TokenSliceType = {
  balance: '0',
  tokens: {},
};

const tokenSlice = createSlice({
  name: 'tokenSlice',
  initialState,
  reducers: {
    updateBalance: (state: TokenSliceType, actions: PayloadAction<Partial<string>>) => {
      state.balance = actions.payload;
    },
    updateNormalBalance: (
      state: TokenSliceType,
      actions: PayloadAction<{ tokenAddress: string; balance: string }>
    ) => {
      const { tokenAddress, balance } = actions.payload;
      const oldToken = state.tokens[tokenAddress];
      if (oldToken) {
        state.tokens[tokenAddress] = { ...oldToken, balance };
      }
    },
    setTokens: (
      state: TokenSliceType,
      actions: PayloadAction<StringListType<StandardToken & { balance: string }>>
    ) => {
      state.tokens = actions.payload;
    },
    upsertToken: (
      state: TokenSliceType,
      actions: PayloadAction<StandardToken & { balance: string }>
    ) => {
      const token = actions.payload;
      const lowAddress = token.address.toLowerCase();
      state.tokens[lowAddress] = { ...token, address: lowAddress };
    },
    deleteToken: (state: TokenSliceType, actions: PayloadAction<StandardToken>) => {
      const token = actions.payload;
      const lowAddress = token.address.toLowerCase();
      delete state.tokens[lowAddress];
    },
  },
});

export default tokenSlice.reducer;
export const { updateBalance, updateNormalBalance, setTokens, upsertToken, deleteToken } =
  tokenSlice.actions;
