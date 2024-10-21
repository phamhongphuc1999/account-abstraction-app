import { TextField, Typography } from '@mui/material';
import { useState } from 'react';
import DownloadBox from 'src/components/DownloadBox';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem, { TitleTextFieldItem } from 'src/components/title-item';
import { generatePoseidonHash } from 'src/services/circom-utils';

export default function GeneratePoseidonHash() {
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState<string | undefined>(undefined);

  async function _generate() {
    if (message.length > 0) {
      const result = await generatePoseidonHash(message);
      setHash(result);
    }
  }

  return (
    <>
      <Typography variant="subtitle1">Generate Poseidon Hash</Typography>
      <BaseForm metadata={{ executeTitle: 'Generate' }} events={{ onExecute: _generate }}>
        <TitleTextFieldItem
          titleWidth="80px"
          title="Message"
          textFieldProps={{
            fullWidth: true,
            onChange: (event) => setMessage(event.target.value),
          }}
          sx={{ mt: 1 }}
        />
      </BaseForm>
      {hash && (
        <div>
          <TitleItem
            titleWidth="80px"
            title="Proof"
            component={
              <TextField
                fullWidth
                value={hash}
                slotProps={{
                  input: { readOnly: true, endAdornment: <CopyIcon copyText={hash} /> },
                }}
              />
            }
            sx={{ mt: 1, alignItems: 'flex-start' }}
          />
          <DownloadBox data={hash} />
        </div>
      )}
    </>
  );
}
