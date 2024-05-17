import { Box, BoxProps, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import ExploreIcon from 'src/components/icons/explore-icon';
import TitleItem from 'src/components/title-item';
import { formatAddress } from 'src/services';

export type GuardianHashType = {
  address: string;
  hash: string;
};

interface Props {
  value: { [address: string]: GuardianHashType };
  events?: {
    onAdd?: (address: string) => Promise<void>;
    onRemove?: (address: string) => void;
  };
  props?: BoxProps;
}

export default function GuardianAddresses({ value, events, props }: Props) {
  const [addressValue, setAddressValue] = useState('');
  const len = Object.values(value).length;

  function onAdd() {
    if (events?.onAdd) {
      events.onAdd(addressValue);
      setAddressValue('');
    }
  }

  function onRemove(address: string) {
    if (events?.onRemove) events.onRemove(address);
  }

  return (
    <Box {...props}>
      <Box sx={{ mb: 1, mt: 2, pt: 1, borderTop: '1px solid #ffffff' }}>
        {Object.values(value).map((item, index) => {
          return (
            <Box key={item.hash} sx={{ display: 'flex', alignItems: 'center' }}>
              <TitleItem
                titleWidth="80px"
                title={`address ${index + 1}`}
                component={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>{formatAddress(item.address, 5)}</Typography>
                    <CopyIcon
                      copyText={item.address}
                      iconProps={{ sx: { fontSize: '16px', color: 'primary.main' } }}
                    />
                    <ExploreIcon hash={item.address} config={{ isShowText: false }} />
                  </Box>
                }
              />
              <TitleItem
                titleWidth="60px"
                title={`hash ${index + 1}`}
                component={<Typography>{formatAddress(item.hash, 5)}</Typography>}
                props={{ sx: { mx: 3 } }}
              />
              <Button variant="outlined" onClick={() => onRemove(item.address)}>
                Remove
              </Button>
            </Box>
          );
        })}
        <Typography>{`${len} ${len > 1 ? 'guardians' : 'guardian'}`}</Typography>
      </Box>
      <TitleItem
        titleWidth="110px"
        title="Addresses"
        component={
          <TextField
            value={addressValue}
            onChange={(event) => setAddressValue(event.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <Typography color="primary.main" sx={{ cursor: 'pointer' }} onClick={() => onAdd()}>
                  Add
                </Typography>
              ),
            }}
          />
        }
        props={{ sx: { mt: 2 } }}
      />
    </Box>
  );
}
