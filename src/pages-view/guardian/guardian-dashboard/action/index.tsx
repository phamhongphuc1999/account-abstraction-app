import { Box, Typography } from '@mui/material';
import AddGuardian from './add-guardian';
import ChangeThreshold from './change-threshold';
import RemoveGuardian from './remove-guardian';

export default function Action() {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography>Action</Typography>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <ChangeThreshold />
        <AddGuardian />
        <RemoveGuardian />
      </Box>
    </Box>
  );
}
