import { Box, Grid2, TextField, Typography } from '@mui/material';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';

export default function Overview() {
  const { threshold, expirePeriod, delay, guardianCount, maxGuardians, hashList, increment } =
    useAppSelector((state) => state.guardian.config);

  return (
    <Box>
      <Typography>Overview</Typography>
      <Grid2 container>
        <Grid2 size={{ md: 7, sm: 12 }}>
          <TitleItem
            titleWidth="110px"
            title="Threshold"
            component={<TextField value={threshold} slotProps={{ input: { readOnly: true } }} />}
            sx={{ mt: 1 }}
          />
          <TitleItem
            titleWidth="110px"
            title="Expire Period"
            component={<TextField value={expirePeriod} slotProps={{ input: { readOnly: true } }} />}
            sx={{ mt: 1 }}
          />
          <TitleItem
            titleWidth="110px"
            title="Delay"
            component={<TextField value={delay} slotProps={{ input: { readOnly: true } }} />}
            sx={{ mt: 1 }}
          />
          <TitleItem
            titleWidth="110px"
            title="Number of Guardians"
            component={
              <TextField value={guardianCount} slotProps={{ input: { readOnly: true } }} />
            }
            sx={{ mt: 1 }}
          />
          <TitleItem
            titleWidth="110px"
            title="Max Guardians"
            component={<TextField value={maxGuardians} slotProps={{ input: { readOnly: true } }} />}
            sx={{ mt: 1 }}
          />
          <TitleItem
            titleWidth="110px"
            title="Current increment"
            component={<TextField value={increment} slotProps={{ input: { readOnly: true } }} />}
            sx={{ mt: 1 }}
          />
        </Grid2>
        <Grid2 size={{ md: 5, sm: 12 }}>
          {hashList.map((hash, index) => {
            return (
              <Box key={hash}>
                <TitleItem
                  titleWidth="80px"
                  title={`Hash ${index + 1}`}
                  component={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>{formatAddress(hash, 5)}</Typography>
                      <CopyIcon copyText={hash} />
                    </Box>
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
            );
          })}
        </Grid2>
      </Grid2>
    </Box>
  );
}
