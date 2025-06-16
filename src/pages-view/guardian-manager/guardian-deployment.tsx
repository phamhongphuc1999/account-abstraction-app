import { Box, BoxProps, Button, Typography } from '@mui/material';
import { Interface } from 'ethers';
import { toast } from 'react-toastify';
import { SIMPLE_SALT } from 'src/configs/constance';
import { AccountAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';

export default function GuardianDeployment(props: BoxProps) {
  const { accountAddress } = useAppSelector((state) => state.user);
  const { sendEntryPoint } = useSendUserOp();

  async function onDeployGuardian() {
    try {
      const accountInter = new Interface(AccountAbi__factory.abi);
      let callData = accountInter.encodeFunctionData('deployGuardian', [SIMPLE_SALT]);
      callData = accountInter.encodeFunctionData('execute', [accountAddress, 0, callData]);
      await sendEntryPoint(callData);
    } catch (error) {
      toast.error(String(error));
    }
  }

  return (
    <Box {...props}>
      <Typography>Deploying your own guardian help you improve your account security</Typography>
      <Button variant="contained" sx={{ mt: 1 }} onClick={onDeployGuardian}>
        Deploy
      </Button>
    </Box>
  );
}
