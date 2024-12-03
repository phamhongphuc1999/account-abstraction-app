import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { useAddressesQuery } from 'src/services/static-query';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { AccountFactoryAbi, AccountFactoryAbi__factory } from './typechain';

export default class AccountFactoryContract extends RootContract<AccountFactoryAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(
      AccountFactoryAbi__factory.connect(address, provider),
      AccountFactoryAbi__factory.abi,
      address
    );
  }

  async getAddress(owner: string, salt: string) {
    return await this.fn.getFunction('getAddress')(owner, salt);
  }
}

export function useAccountFactoryContract(type: ContractType = 'reader') {
  const { ACCOUNT_FACTORY_ADDRESS } = useAddressesQuery();
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    if (isAddress(ACCOUNT_FACTORY_ADDRESS)) {
      if (type == 'reader' && reader)
        return new AccountFactoryContract(reader, ACCOUNT_FACTORY_ADDRESS);
      else if (type == 'signer' && signer)
        return new AccountFactoryContract(signer, ACCOUNT_FACTORY_ADDRESS);
    }
    return undefined;
  }, [type, reader, signer, ACCOUNT_FACTORY_ADDRESS]);
}
