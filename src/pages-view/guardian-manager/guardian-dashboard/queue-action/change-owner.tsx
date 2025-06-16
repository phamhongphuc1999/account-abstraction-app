import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { Button } from '@mui/material';
import { Interface, isAddress } from 'ethers';
import { toast } from 'react-toastify';
import { AccountAbi__factory, ZKGuardianAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { useAddressesQuery } from 'src/services/static-query';

export default function ChangeOwner() {
  const { ACCOUNT_FACTORY_ADDRESS } = useAddressesQuery();
  const { guardianAddress } = useAppSelector((state) => state.guardian);
  const { sendEntryPoint } = useSendUserOp();

  async function onChangeOwner() {
    try {
      if (!isAddress(ACCOUNT_FACTORY_ADDRESS)) throw Error('ACCOUNT_FACTORY_ADDRESS is invalid');
      if (!isAddress(guardianAddress)) throw Error('guardianAddress is invalid');
      const guardianInter = new Interface(ZKGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('changeOwner', [ACCOUNT_FACTORY_ADDRESS]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    } catch (error) {
      toast.error(String(error));
    }
  }

  return (
    <Button variant="outlined" onClick={onChangeOwner} startIcon={<ChangeCircleOutlinedIcon />}>
      Change Owner
    </Button>
  );
}
