import { Typography } from '@mui/material';
import { useState } from 'react';
import CssReactJson from 'src/components/css-react-json';
import DownloadBox from 'src/components/DownloadBox';
import BaseForm from 'src/components/form/base-form';
import TitleItem, { TitleTextFieldItem } from 'src/components/title-item';
import { convertJubProof, generateWitness, makeVerifiedInput } from 'src/services/guardian-utils';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';

export default function GenerateWitness() {
  const { jubAccount } = useBabyJub();
  const [increment, setIncrement] = useState('');
  const [address, setAddress] = useState('');
  const [witness, setWitness] = useState<
    { A: Array<string>; R8: Array<string>; S: Array<string>; msg: Array<string> } | undefined
  >(undefined);

  async function _generate() {
    if (jubAccount && increment.length > 0) {
      const proof = await generateWitness(
        makeVerifiedInput(address, increment),
        jubAccount.privateKey
      );
      setWitness(convertJubProof(proof));
    }
  }

  return (
    <>
      <Typography variant="subtitle1">Generate Witness</Typography>
      <BaseForm metadata={{ executeTitle: 'Generate' }} events={{ onExecute: _generate }}>
        <TitleTextFieldItem
          titleWidth="80px"
          title="Increment"
          textFieldProps={{
            fullWidth: true,
            onChange: (event) => setIncrement(event.target.value),
          }}
          sx={{ mt: 1 }}
        />
        <TitleTextFieldItem
          titleWidth="80px"
          title="Address"
          textFieldProps={{
            fullWidth: true,
            onChange: (event) => setAddress(event.target.value),
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
