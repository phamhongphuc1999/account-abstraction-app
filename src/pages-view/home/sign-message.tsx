import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { BoxProps, TextField } from '@mui/material';
import { useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseActionForm from 'src/components/form/base-action-form';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  props?: BoxProps;
}

export default function SignMessage({ props }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const { signer } = usRpcProviderContext();

  async function signMessage() {
    if (message.length > 0 && signer) {
      const _result = await signer.signMessage(message);
      setResult(_result);
    }
  }

  return (
    <BaseActionForm
      IconComponent={DrawOutlinedIcon}
      title="Sign Message"
      boxIconProps={{ onClick: () => setOpen(true) }}
      props={props}
    >
      <BaseDialog open={open} onClose={() => setOpen(false)} title="Sign Message">
        <BaseForm events={{ onExecute: signMessage }}>
          <TitleItem
            titleWidth="80px"
            title="Message"
            component={<TextField fullWidth onChange={(event) => setMessage(event.target.value)} />}
          />
          <TitleItem
            titleWidth="80px"
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
    </BaseActionForm>
  );
}
