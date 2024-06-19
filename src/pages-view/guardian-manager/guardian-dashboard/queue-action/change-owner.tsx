import { Button } from '@mui/material';
import { Interface, isAddress } from 'ethers';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import StaticQuery from 'src/services/static-query';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

export default function ChangeOwner() {
  const { chainId } = useAppSelector((state) => state.config);
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const { sendEntryPoint } = useSendUserOp();

  async function onChangeOwner() {
    const accountFactoryAddress = StaticQuery.getAddresses(chainId).ACCOUNT_FACTORY_ADDRESS;
    if (isAddress(accountFactoryAddress) && isAddress(guardianAddress)) {
      const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('changeOwner', [accountFactoryAddress]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    }
  }

  return (
    <Button variant="outlined" onClick={onChangeOwner} startIcon={<ChangeCircleOutlinedIcon />}>
      Change Owner
    </Button>
  );
}
