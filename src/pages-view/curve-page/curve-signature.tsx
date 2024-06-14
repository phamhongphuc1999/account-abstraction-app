import { bufferToHex } from '@ethereumjs/util';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { BoxProps } from '@mui/material';
import { useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import BaseActionForm from 'src/components/form/base-action-form';
import BaseForm from 'src/components/form/base-form';
import CopyIcon from 'src/components/icons/copy-icon';
import { TitleTextFieldItem } from 'src/components/title-item';
import { KeyringType } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

interface Props {
  keyring: KeyringType;
  props?: BoxProps;
}

export default function CurveSignature({ keyring, props }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  async function signMessage() {
    if (message.length > 0) {
      const _result = keyring.accounts[0].sign(message);
      setResult(bufferToHex(Buffer.from(_result.raw)));
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
          <TitleTextFieldItem
            titleWidth="80px"
            title="Message"
            textFieldProps={{
              fullWidth: true,
              onChange: (event) => setMessage(event.target.value),
            }}
            props={{ sx: { mt: 1 } }}
          />
          <TitleTextFieldItem
            titleWidth="80px"
            title="Result"
            textFieldProps={{
              fullWidth: true,
              InputProps: {
                readOnly: true,
                endAdornment: result.length > 0 ? <CopyIcon copyText={result} /> : <></>,
              },
              value: result,
            }}
            props={{ sx: { mt: 1 } }}
          />
        </BaseForm>
      </BaseDialog>
    </BaseActionForm>
  );
}
