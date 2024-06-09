import { Box, BoxProps } from '@mui/material';
import { useHashRegisterContext } from 'src/context/hash-register-context';
import PasswordForm from './password-form';
import RevealMnemonic from './reveal-mnemonic';

interface Props {
  props?: BoxProps;
}

export default function RegisterForm({ props }: Props) {
  const { step } = useHashRegisterContext();

  return (
    <Box {...props}>
      {step == 1 && <PasswordForm />}
      {step == 2 && <RevealMnemonic />}
    </Box>
  );
}
