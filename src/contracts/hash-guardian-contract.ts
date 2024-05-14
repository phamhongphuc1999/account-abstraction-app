import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { HashGuardianAbi, HashGuardianAbi__factory } from './typechain';

export class HashGuardianContract extends RootContract<HashGuardianAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(
      HashGuardianAbi__factory.connect(address, provider),
      HashGuardianAbi__factory.abi,
      address
    );
  }
}

export function useGuardianContract(address: string, type: ContractType = 'reader') {
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    if (isAddress(address)) {
      if (type == 'reader' && reader) return new HashGuardianContract(reader, address);
      else if (type == 'signer' && signer) return new HashGuardianContract(signer, address);
    }
    return undefined;
  }, [type, reader, signer, address]);
}
