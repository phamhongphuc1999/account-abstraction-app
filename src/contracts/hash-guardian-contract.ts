import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { HashGuardianAbi, HashGuardianAbi__factory } from './typechain';

export default class HashGuardianContract extends RootContract<HashGuardianAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(
      HashGuardianAbi__factory.connect(address, provider),
      HashGuardianAbi__factory.abi,
      address
    );
  }
}

export function useHashGuardianContract(type: ContractType = 'reader') {
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    if (isAddress(guardianAddress)) {
      if (type == 'reader' && reader) return new HashGuardianContract(reader, guardianAddress);
      else if (type == 'signer' && signer) return new HashGuardianContract(signer, guardianAddress);
    }
    return undefined;
  }, [type, reader, signer, guardianAddress]);
}
