import { Box, BoxProps } from '@mui/material';
import ActionDashboard from './action-dashboard';
import Overview from './overview';
import QueueAction from './queue-action';

interface Props {
  props?: BoxProps;
}

export default function GuardianDashboard({ props }: Props) {
  return (
    <Box {...props}>
      <Overview />
      <QueueAction />
      <ActionDashboard />
    </Box>
  );
}
