import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/hook';
import StaticQuery from 'src/services/static-query';
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
    return await this.fn.getAddress(owner, salt);
  }
}

export function useAccountFactoryContract(type: ContractType = 'reader') {
  const { chainId } = useAppSelector((state) => state.config);
  const { reader, signer } = usRpcProviderContext();

  return useMemo(() => {
    const { ACCOUNT_FACTORY_ADDRESS } = StaticQuery.getAddresses(chainId);
    if (isAddress(ACCOUNT_FACTORY_ADDRESS)) {
      if (type == 'reader' && reader)
        return new AccountFactoryContract(reader, ACCOUNT_FACTORY_ADDRESS);
      else if (type == 'signer' && signer)
        return new AccountFactoryContract(signer, ACCOUNT_FACTORY_ADDRESS);
    }
    return undefined;
  }, [chainId, type, reader, signer]);
}
