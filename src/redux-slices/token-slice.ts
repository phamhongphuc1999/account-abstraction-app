import { PayloadAction, createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { AccountType, StandardToken, StringListType } from 'src/global';

export interface TokenBalanceType {
  balance: string;
  tokens: StringListType<StandardToken & { balance: string }>;
}

export interface TokenSliceType {
  owner: TokenBalanceType;
  account: TokenBalanceType;
}

const initialState: TokenSliceType = {
  owner: { balance: '0', tokens: {} },
  account: { balance: '0', tokens: {} },
};

const tokenSlice = createSlice({
  name: 'tokenSlice',
  initialState,
  reducers: {
    updateBalance: (
      state: TokenSliceType,
      actions: PayloadAction<{ balance: string; type: AccountType }>
    ) => {
      const { balance, type } = actions.payload;
      if (type == 'accountAbstraction') state.account.balance = balance;
      else state.owner.balance = balance;
    },
    updateNormalBalance: (
      state: TokenSliceType,
      actions: PayloadAction<{ tokenAddress: string; balance: string; type: AccountType }>
    ) => {
      const { tokenAddress, balance, type } = actions.payload;
      const _key: 'account' | 'owner' = type == 'accountAbstraction' ? 'account' : 'owner';
      const oldToken = state[_key].tokens[tokenAddress];
      if (oldToken) state[_key].tokens[tokenAddress] = { ...oldToken, balance };
    },
    setTokens: (
      state: TokenSliceType,
      actions: PayloadAction<{
        tokens: StringListType<StandardToken & { balance: string }>;
        type: AccountType;
      }>
    ) => {
      const { tokens, type } = actions.payload;
      if (type == 'accountAbstraction') state.account.tokens = tokens;
      else state.owner.tokens = tokens;
    },
    upsertToken: (
      state: TokenSliceType,
      actions: PayloadAction<{ token: StandardToken; accountBalance: string; ownerBalance: string }>
    ) => {
      const { token, accountBalance, ownerBalance } = actions.payload;
      const lowAddress = token.address.toLowerCase();
      state.owner.tokens[lowAddress] = { ...token, address: lowAddress, balance: ownerBalance };
      state.account.tokens[lowAddress] = { ...token, address: lowAddress, balance: accountBalance };
    },
    deleteToken: (state: TokenSliceType, actions: PayloadAction<StandardToken>) => {
      const token = actions.payload;
      const lowAddress = token.address.toLowerCase();
      delete state.account.tokens[lowAddress];
      delete state.owner.tokens[lowAddress];
    },
  },
});

export default tokenSlice.reducer;
export const { updateBalance, updateNormalBalance, setTokens, upsertToken, deleteToken } =
  tokenSlice.actions;

export const getTokenData = createDraftSafeSelector(
  [(state: TokenSliceType) => state, (_: TokenSliceType, type: AccountType) => type],
  (state: TokenSliceType, type) => {
    if (type == 'accountAbstraction') return state.account;
    else return state.owner;
  }
);
