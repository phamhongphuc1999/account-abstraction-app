import { BaseContract, InterfaceAbi } from 'ethers';

export default class RootContract<T extends BaseContract = BaseContract> {
  public fn: T;
  public abi: InterfaceAbi;
  public address: string;

  constructor(fn: T, abi: InterfaceAbi, address: string) {
    this.fn = fn;
    this.abi = abi;
    this.address = address;
  }
}
