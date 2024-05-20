import { Box, Button } from '@mui/material';
import { Interface, isAddress } from 'ethers';
import { AccountAbi__factory, HashGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/hook';
import StaticQuery from 'src/services/static-query';

export default function ChangeOwner() {
  const { chainId } = useAppSelector((state) => state.config);
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const { sendEntryPoint } = useSendUserOp();

  async function onChangeOwner() {
    const accountFactoryAddress = StaticQuery.getAddresses(chainId).ACCOUNT_FACTORY_ADDRESS;
    if (isAddress(accountFactoryAddress) && isAddress(guardianAddress)) {
      const guardianInter = new Interface(HashGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('changeOwner', [accountFactoryAddress]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    }
  }

  return (
    <Box>
      <Button variant="contained" onClick={onChangeOwner}>
        Change Owner
      </Button>
    </Box>
  );
}
