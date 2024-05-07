import { GlobalProviderType } from 'src/global';
import RootContract from './root-contract';
import { BEP20, BEP20__factory } from './typechain';

export class Bep20Contract extends RootContract<BEP20> {
  constructor(provider: GlobalProviderType, address: string) {
    super(BEP20__factory.connect(address, provider), BEP20__factory.abi, address);
  }

  async balanceOf(address: string) {
    return await this.fn.balanceOf(address);
  }
}
