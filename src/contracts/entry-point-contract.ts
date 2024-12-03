import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { useAddressesQuery } from 'src/services/static-query';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { EntryPointAbi, EntryPointAbi__factory } from './typechain';

export default class EntryPointContract extends RootContract<EntryPointAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(EntryPointAbi__factory.connect(address, provider), EntryPointAbi__factory.abi, address);
  }
}

export function useEntryPointContract(type: ContractType = 'reader') {
  const { ENTRY_POINT_ADDRESS } = useAddressesQuery();
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    if (isAddress(ENTRY_POINT_ADDRESS)) {
      if (type == 'reader' && reader) return new EntryPointContract(reader, ENTRY_POINT_ADDRESS);
      else if (type == 'signer' && signer)
        return new EntryPointContract(signer, ENTRY_POINT_ADDRESS);
    }
    return undefined;
  }, [type, reader, signer, ENTRY_POINT_ADDRESS]);
}
