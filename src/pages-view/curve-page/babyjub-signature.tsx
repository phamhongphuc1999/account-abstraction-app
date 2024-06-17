import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { BoxProps } from '@mui/material';
import { useState } from 'react';
import BaseDialog from 'src/components/BaseDialog';
import CssReactJson from 'src/components/css-react-json';
import BaseActionForm from 'src/components/form/base-action-form';
import BaseForm from 'src/components/form/base-form';
import TitleItem, { TitleTextFieldItem } from 'src/components/title-item';
import { convertBabyJubSignature } from 'src/services';
import BabyjubAccount, {
  JubSignatureType,
} from 'src/wallet-connection/hash-system-wallet/hash-account/babyjub-account';

interface Props {
  babyJubAccount: BabyjubAccount;
  props?: BoxProps;
}

export default function BabyJubSignature({ babyJubAccount, props }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<JubSignatureType | null>(null);

  function onSign() {
    const _result = babyJubAccount.sign(message);
    setResult(_result);
  }

  return (
    <BaseActionForm
      IconComponent={DrawOutlinedIcon}
      title="Sign Message"
      boxIconProps={{ onClick: () => setOpen(true) }}
      props={props}
    >
      <BaseDialog open={open} onClose={() => setOpen(false)} title="Sign Message">
        <BaseForm events={{ onExecute: onSign }}>
          <TitleTextFieldItem
            titleWidth="80px"
            title="Message"
            textFieldProps={{
              fullWidth: true,
              onChange: (event) => setMessage(event.target.value),
            }}
            props={{ sx: { mt: 1 } }}
          />
          {result && (
            <TitleItem
              titleWidth="80px"
              title="Proof"
              component={
                <CssReactJson
                  jsonProps={{ src: convertBabyJubSignature(result), collapsed: true }}
                />
              }
              props={{ sx: { mt: 1, alignItems: 'flex-start' } }}
            />
          )}
        </BaseForm>
      </BaseDialog>
    </BaseActionForm>
  );
}
