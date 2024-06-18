import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { ZKGuardianAbi, ZKGuardianAbi__factory } from './typechain';

export default class ZKGuardianContract extends RootContract<ZKGuardianAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(ZKGuardianAbi__factory.connect(address, provider), ZKGuardianAbi__factory.abi, address);
  }
}

export function useZKGuardianContract(type: ContractType = 'reader') {
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    if (isAddress(guardianAddress)) {
      if (type == 'reader' && reader) return new ZKGuardianContract(reader, guardianAddress);
      else if (type == 'signer' && signer) return new ZKGuardianContract(signer, guardianAddress);
    }
    return undefined;
  }, [type, reader, signer, guardianAddress]);
}
