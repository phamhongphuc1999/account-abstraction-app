import BigNumber from 'bignumber.js';
import { JsonRpcProvider } from 'ethers';
import Bep20Contract from 'src/contracts/bep20-contract';
import { StandardToken } from 'src/global';

export default class BalanceService {
  static async native(reader: JsonRpcProvider, accountAddress: string, tokenDecimal: number) {
    const raw = await reader.getBalance(accountAddress);
    const bigBalance = BigNumber(raw.toString());
    const _balance = bigBalance.dividedBy(BigNumber('10').pow(tokenDecimal)).toFixed();
    return _balance;
  }

  static async normal(reader: JsonRpcProvider, accountAddress: string, token: StandardToken) {
    const _bep20 = new Bep20Contract(reader, token.address);
    const raw = await _bep20.fn.balanceOf(accountAddress);
    const bigBalance = BigNumber(raw.toString());
    const _balance = bigBalance.dividedBy(BigNumber('10').pow(token.decimal)).toFixed();
    return _balance;
  }
}
