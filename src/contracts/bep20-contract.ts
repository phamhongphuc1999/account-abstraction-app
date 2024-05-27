import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { BEP20Abi, BEP20Abi__factory } from './typechain';

export default class Bep20Contract extends RootContract<BEP20Abi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(BEP20Abi__factory.connect(address, provider), BEP20Abi__factory.abi, address);
  }
}

export function useBep20Contract(tokenAddress: string, type: ContractType = 'reader') {
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    if (isAddress(tokenAddress)) {
      if (type == 'reader' && reader) return new Bep20Contract(reader, tokenAddress);
      else if (type == 'signer' && signer) return new Bep20Contract(signer, tokenAddress);
    }
    return undefined;
  }, [type, reader, signer, tokenAddress]);
}
