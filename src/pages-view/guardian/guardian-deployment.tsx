import { Box, BoxProps, Button, Typography } from '@mui/material';
import { Interface } from 'ethers';
import { SIMPLE_SALT } from 'src/configs/constance';
import { AccountAbi__factory } from 'src/contracts/typechain';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/hook';

interface Props {
  props?: BoxProps;
}

export default function GuardianDeployment({ props }: Props) {
  const { accountAddress } = useAppSelector((state) => state.user);
  const { sendEntryPoint } = useSendUserOp();

  async function onDeployGuardian() {
    const accountInter = new Interface(AccountAbi__factory.abi);
    let callData = accountInter.encodeFunctionData('deployGuardian', [SIMPLE_SALT]);
    callData = accountInter.encodeFunctionData('execute', [accountAddress, 0, callData]);
    await sendEntryPoint(callData);
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
