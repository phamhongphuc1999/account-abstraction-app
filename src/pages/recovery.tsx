import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GuardianRecovery from 'src/pages-view/recovery/guardian-recovery';
import OwnerRecovery from 'src/pages-view/recovery/owner-recovery';

export default function Recovery() {
  const navigate = useNavigate();
  const { position: urlPosition } = useParams();
  const [position, setPosition] = useState(urlPosition == 'guardian' ? 'guardian' : 'owner');

  function onPositionChange() {
    setPosition((preValue) => {
      const newValue = preValue == 'owner' ? 'guardian' : 'owner';
      navigate(`/recovery/${newValue}`);
      return newValue;
    });
  }
  return (
    <Box>
      <Typography variant="subtitle1">Recovery</Typography>
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>You are</Typography>
        <Button variant="outlined" onClick={onPositionChange}>
          {position}
        </Button>
      </Box>
      {position == 'owner' ? <OwnerRecovery /> : <GuardianRecovery />}
    </Box>
  );
}
