import { isAddress } from 'ethers';
import { useMemo } from 'react';
import { ContractType, GlobalProviderType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/hook';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import RootContract from './root-contract';
import { AccountAbi, AccountAbi__factory } from './typechain';

export class AccountContract extends RootContract<AccountAbi> {
  constructor(provider: GlobalProviderType, address: string) {
    super(AccountAbi__factory.connect(address, provider), AccountAbi__factory.abi, address);
  }
}

export function useAccountContract(type: ContractType = 'reader') {
  const { reader, signer } = usRpcProviderContext();
  const { accountAddress, deployType } = useAppSelector((state) => state.user);

  return useMemo(() => {
    if (isAddress(accountAddress) && deployType == 'deployed') {
      if (type == 'reader' && reader) return new AccountContract(reader, accountAddress);
      else if (type == 'signer' && signer) return new AccountContract(signer, accountAddress);
    }
    return undefined;
  }, [type, reader, signer, accountAddress, deployType]);
}
