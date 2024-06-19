import { Box, Grid, TextField, Typography } from '@mui/material';
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
      <Grid container>
        <Grid item md={7} sm={12}>
          <TitleItem
            titleWidth="110px"
            title="Threshold"
            component={<TextField value={threshold} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="110px"
            title="Expire Period"
            component={<TextField value={expirePeriod} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="110px"
            title="Delay"
            component={<TextField value={delay} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="110px"
            title="Number of Guardians"
            component={<TextField value={guardianCount} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="110px"
            title="Max Guardians"
            component={<TextField value={maxGuardians} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
          <TitleItem
            titleWidth="110px"
            title="Current increment"
            component={<TextField value={increment} InputProps={{ readOnly: true }} />}
            props={{ sx: { mt: 1 } }}
          />
        </Grid>
        <Grid item md={5} sm={12}>
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
                  props={{ sx: { mt: 1 } }}
                />
              </Box>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
}
