import { Typography } from '@mui/material';
import { useState } from 'react';
import CssReactJson from 'src/components/css-react-json';
import DownloadBox from 'src/components/DownloadBox';
import BaseForm from 'src/components/form/base-form';
import TitleItem, { TitleTextFieldItem } from 'src/components/title-item';
import { extendNum, generateWitness } from 'src/services/circom-utils';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

export default function GenerateWitness() {
  const { jubAccount } = useBabyJub();
  const [message, setMessage] = useState('');
  const [witness, setWitness] = useState<
    { A: Array<string>; R8: Array<string>; S: Array<string>; msg: Array<string> } | undefined
  >(undefined);

  async function _generate() {
    if (jubAccount && message.length > 0) {
      const { A, R8, S, msg } = await generateWitness(extendNum(message), jubAccount.privateKey);
      setWitness({
        A: A.map((item) => item.toString()),
        R8: R8.map((item) => item.toString()),
        S: S.map((item) => item.toString()),
        msg: msg.map((item) => item.toString()),
      });
    }
  }

  return (
    <>
      <Typography variant="subtitle1">Generate Witness</Typography>
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
      {witness && (
        <div>
          <TitleItem
            titleWidth="80px"
            title="Proof"
            component={<CssReactJson jsonProps={{ src: witness, collapsed: true }} />}
            sx={{ mt: 1, alignItems: 'flex-start' }}
          />
          <DownloadBox data={witness} />
        </div>
      )}
    </>
  );
}
