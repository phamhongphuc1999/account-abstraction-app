import { isAddress } from 'ethers';
import { useCallback } from 'react';
import { SIMPLE_SALT } from 'src/configs/constance';
import { useAppSelector } from 'src/redux-slices/store';
import { getAccountInitCode, toBeHexlify } from 'src/services';
import StaticQuery from 'src/services/static-query';
import UserOperationService from 'src/user-operation-service';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';
import useNonce from './use-nonce';

export default function useSendUserOp() {
  const { chainId } = useAppSelector((state) => state.config);
  const { ownerAddress, accountAddress, deployType } = useAppSelector((state) => state.user);
  const { ENTRY_POINT_ADDRESS, ACCOUNT_FACTORY_ADDRESS } = StaticQuery.getAddresses(chainId);
  const { reader, signer, bundler } = usRpcProviderContext();
  const { getNonce } = useNonce();

  const _send = useCallback(
    async (callData: string) => {
      try {
        if (
          isAddress(ENTRY_POINT_ADDRESS) &&
          isAddress(accountAddress) &&
          isAddress(ownerAddress) &&
          reader &&
          signer &&
          bundler &&
          deployType != 'initial'
        ) {
          const _code =
            deployType == 'deployed'
              ? undefined
              : await getAccountInitCode(ownerAddress, SIMPLE_SALT, ACCOUNT_FACTORY_ADDRESS);
          const nonce = await getNonce();
          if (nonce != undefined) {
            const op = await UserOperationService.fillSign(
              { sender: accountAddress, nonce: toBeHexlify(nonce), callData, initCode: _code },
              reader,
              signer,
              ENTRY_POINT_ADDRESS,
              chainId
            );
            await bundler.sendUserOperation(op, ENTRY_POINT_ADDRESS);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [
      ENTRY_POINT_ADDRESS,
      ACCOUNT_FACTORY_ADDRESS,
      accountAddress,
      ownerAddress,
      reader,
      signer,
      bundler,
      deployType,
      chainId,
      getNonce,
    ]
  );

  return { sendEntryPoint: _send };
}
