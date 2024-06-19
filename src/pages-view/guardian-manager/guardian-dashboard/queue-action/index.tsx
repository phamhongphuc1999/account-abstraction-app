import { Box, Typography } from '@mui/material';
import AddGuardian from './add-guardian';
import ChangeOwner from './change-owner';
import ChangeThreshold from './change-threshold';
import RemoveGuardian from './remove-guardian';

export default function QueueAction() {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography>Create Queue Action</Typography>
      <Box
        sx={(theme) => ({
          mt: 1,
          display: 'flex',
          gap: 1,
          [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
        })}
      >
        <ChangeOwner />
        <ChangeThreshold />
        <AddGuardian />
        <RemoveGuardian />
      </Box>
    </Box>
  );
}
