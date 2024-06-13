import { Box, BoxProps } from '@mui/material';
import { useHashRegisterSelector } from 'src/context/hash-register-context';
import ChooseSignatureSchema from './choose-signature-schema';
import ConfirmMnemonic from './confirm-mnemonic';
import PasswordForm from './password-form';
import RevealMnemonic from './reveal-mnemonic';

interface Props {
  props?: BoxProps;
}

export default function RegisterForm({ props }: Props) {
  const { step } = useHashRegisterSelector((state) => state.data);

  return (
    <Box {...props}>
      {step == 1 && <ChooseSignatureSchema />}
      {step == 2 && <PasswordForm />}
      {step == 3 && <RevealMnemonic />}
      {step == 4 && <ConfirmMnemonic />}
    </Box>
  );
}
