import { isAddress } from 'ethers';
import { useCallback } from 'react';
import { useEntryPointContract } from 'src/contracts/entry-point-contract';
import { useAppSelector } from 'src/redux-slices/hook';

export default function useNonce() {
  const { accountAddress } = useAppSelector((state) => state.user);
  const entryPointContract = useEntryPointContract();

  const getNonce = useCallback(async () => {
    if (isAddress(accountAddress) && entryPointContract)
      return await entryPointContract.fn.getNonce(accountAddress, '0x0');
  }, [accountAddress, entryPointContract]);

  return { getNonce };
}
