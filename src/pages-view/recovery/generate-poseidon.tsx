import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { generatePoseidonHash } from 'src/services/circom-utils';

export default function GeneratePoseidon() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  async function onGeneratePoseidon() {
    const _result = await generatePoseidonHash(text);
    setResult(_result);
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Generate Poseidon
      </Button>
      <BaseDialog open={open} onClose={() => setOpen(false)} title="Generate Poseidon Hash">
        <BaseForm
          metadata={{ executeTitle: 'Generate' }}
          events={{ onExecute: onGeneratePoseidon }}
        >
          <TitleItem
            titleWidth="50px"
            title="Text"
            component={<TextField fullWidth onChange={(event) => setText(event.target.value)} />}
          />
          <TitleItem
            titleWidth="50px"
            title="Result"
            component={
              <TextField
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: result.length > 0 ? <CopyIcon copyText={result} /> : <></>,
                }}
                value={result}
              />
            }
            props={{ sx: { mt: 1 } }}
          />
        </BaseForm>
      </BaseDialog>
    </>
  );
}
