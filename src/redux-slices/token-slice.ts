import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ActionToken, StringListType } from 'src/global';

export interface TokenSliceType {
  balance: string;
  tokens: StringListType<ActionToken & { balance: string }>;
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
  },
});

export default tokenSlice.reducer;
export const { updateBalance } = tokenSlice.actions;
