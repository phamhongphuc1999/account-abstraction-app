import { Box, BoxProps } from '@mui/material';
import Action from './action';
import Overview from './overview';

interface Props {
  props?: BoxProps;
}

export default function GuardianDashboard({ props }: Props) {
  return (
    <Box {...props}>
      <Overview />
      <Action />
    </Box>
  );
}
