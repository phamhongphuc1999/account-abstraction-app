import { GlobalProviderType } from 'src/global';
import RootContract from './root-contract';
import { MultiCallAbi, MultiCallAbi__factory } from './typechain';

export default class MultiCallContract extends RootContract<MultiCallAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(MultiCallAbi__factory.connect(address, provider), MultiCallAbi__factory.abi, address);
  }
}
