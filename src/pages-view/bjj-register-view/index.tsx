import { Box, BoxProps } from '@mui/material';
import { useHashRegisterSelector } from 'src/context/hash-register-context';
import PasswordForm from '../curve-register-view/password-form';
import RevealPrivateKey from './reveal-private-key';

export default function BJJRegisterView(props: BoxProps) {
  const { step } = useHashRegisterSelector((state) => state.data);

  return (
    <Box {...props}>
      {step == 1 && (
        <PasswordForm
          step={1}
          seoProps={{ title: 'Guardian Key Register | Password', isShowDefault: false }}
        />
      )}
      {step == 2 && <RevealPrivateKey />}
    </Box>
  );
}
