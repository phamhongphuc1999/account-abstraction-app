import { useState } from 'react';
import CssReactJson from 'src/components/css-react-json';
import BaseForm from 'src/components/form/base-form';
import TitleItem, { TitleTextFieldItem } from 'src/components/title-item';
import { JubSignatureType } from 'src/global';
import { convertBabyJubSignature } from 'src/services';
import BJJAccount from 'src/wallet-connection/hash-system-wallet/hash-account/bjj-account';

interface Props {
  babyJubAccount: BJJAccount;
}

export default function BJJSignature({ babyJubAccount }: Props) {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<JubSignatureType | null>(null);

  function onSign() {
    const _result = babyJubAccount.sign(message);
    setResult(_result);
  }

  return (
    <BaseForm metadata={{ executeTitle: 'Sign' }} events={{ onExecute: onSign }}>
      <TitleTextFieldItem
        titleWidth="80px"
        title="Message"
        textFieldProps={{
          fullWidth: true,
          onChange: (event) => setMessage(event.target.value),
        }}
        sx={{ mt: 1 }}
      />
      {result && (
        <TitleItem
          titleWidth="80px"
          title="Signature"
          component={
            <CssReactJson jsonProps={{ src: convertBabyJubSignature(result), collapsed: true }} />
          }
          sx={{ mt: 1, alignItems: 'flex-start' }}
        />
      )}
    </BaseForm>
  );
}
