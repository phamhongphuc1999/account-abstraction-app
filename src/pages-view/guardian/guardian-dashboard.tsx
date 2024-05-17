import { Box, BoxProps, Typography } from '@mui/material';
import TitleItem from 'src/components/title-item';

interface Props {
  props?: BoxProps;
}

export default function GuardianDashboard({ props }: Props) {
  return (
    <Box {...props}>
      <TitleItem
        titleWidth="65px"
        title="Token"
        component={<Typography />}
        props={{ sx: { mt: 1 } }}
      />
    </Box>
  );
}
