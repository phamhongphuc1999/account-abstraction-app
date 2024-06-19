import { useState } from 'react';
import CssReactJson from 'src/components/css-react-json';
import BaseForm from 'src/components/form/base-form';
import TitleItem, { TitleTextFieldItem } from 'src/components/title-item';
import { JubSignatureType } from 'src/global';
import { convertBabyJubSignature } from 'src/services';
import BabyjubAccount from 'src/wallet-connection/hash-system-wallet/hash-account/babyjub-account';

interface Props {
  babyJubAccount: BabyjubAccount;
}

export default function BabyJubSignature({ babyJubAccount }: Props) {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<JubSignatureType | null>(null);

  function onSign() {
    const _result = babyJubAccount.sign(message);
    setResult(_result);
  }

  return (
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
          title="Signature"
          component={
            <CssReactJson jsonProps={{ src: convertBabyJubSignature(result), collapsed: true }} />
          }
          props={{ sx: { mt: 1, alignItems: 'flex-start' } }}
        />
      )}
    </BaseForm>
  );
}