import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHashGuardianContract } from 'src/contracts/hash-guardian-contract';
import GuardianRecovery from 'src/pages-view/recovery/guardian-recovery';
import OwnerRecovery from 'src/pages-view/recovery/owner-recovery';

export default function Recovery() {
  const navigate = useNavigate();
  const { position: urlPosition } = useParams();
  const [position, setPosition] = useState(urlPosition == 'guardian' ? 'guardian' : 'owner');
  const [enoughConfirm, setEnoughConfirm] = useState(false);
  const [tempNewOwner, setTempNewOwner] = useState('');
  const guardianContract = useHashGuardianContract();

  function onPositionChange() {
    setPosition((preValue) => {
      const newValue = preValue == 'owner' ? 'guardian' : 'owner';
      navigate(`/recovery/${newValue}`);
      return newValue;
    });
  }

  const _fetchEnoughConfirm = useCallback(async () => {
    if (guardianContract) {
      const _isEnoughConfirm = await guardianContract.fn.isEnoughComfirm();
      setEnoughConfirm(_isEnoughConfirm);
      const _tempNewOwner = await guardianContract.fn._tempNewOwner();
      setTempNewOwner(_tempNewOwner);
    }
  }, [guardianContract]);

  useEffect(() => {
    _fetchEnoughConfirm();
  }, [_fetchEnoughConfirm]);

  return (
    <Box>
      <Typography variant="subtitle1">Recovery</Typography>
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>You are</Typography>
        <Button variant="outlined" onClick={onPositionChange}>
          {position}
        </Button>
      </Box>
      {position == 'owner' ? (
        <OwnerRecovery enoughConfirm={enoughConfirm} tempNewOwner={tempNewOwner} />
      ) : (
        <GuardianRecovery />
      )}
    </Box>
  );
}
