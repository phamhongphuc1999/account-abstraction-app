import { Box, Button, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Groth16Proof } from 'snarkjs';
import CssReactJson from 'src/components/css-react-json';
import CopyIcon from 'src/components/icons/copy-icon';
import TitleItem from 'src/components/title-item';
import { ProofCallDataType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';
import {
  extendNum,
  generateCalldata,
  generatePoseidonHash,
  generateProof,
  verifyProof,
} from 'src/services/circom-utils';
import { useBabyJub } from 'src/wallet-connection/hash-system-wallet/hash-wallet-context';
import SubmitProof from './submit-proof';

export default function ConfirmRecovery() {
  const { config } = useAppSelector((state) => state.guardian);
  const { increment } = config;
  const [hash, setHash] = useState('');
  const [proof, setProof] = useState<Groth16Proof | null>(null);
  const [callDataProof, setCallDataProof] = useState<ProofCallDataType | null>(null);
  const { jubAccount, pacPubKey } = useBabyJub();

  const _generate = useCallback(async () => {
    if (jubAccount && pacPubKey.length > 0) {
      try {
        const _hash = await generatePoseidonHash(pacPubKey, 'hex');
        setHash(_hash);
        const _proof = await generateProof(extendNum(increment.toString()), jubAccount.privateKey);
        setProof(_proof.proof);
        const verify = await verifyProof(_proof.proof, _proof.publicSignals);
        if (verify) {
          const _callDataProof = await generateCalldata(_proof.proof, _proof.publicSignals);
          setCallDataProof(_callDataProof);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [jubAccount, increment, pacPubKey]);

  return (
    <Box>
      <Typography>{`Current increment: ${increment}`}</Typography>
      <Box>
        <Button variant="contained" onClick={_generate}>
          Generate Proof
        </Button>
        {callDataProof && <SubmitProof calldata={callDataProof} />}
      </Box>
      {proof && (
        <>
          <TitleItem
            titleWidth="80px"
            title="Your hash"
            component={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{formatAddress(hash, 5)}</Typography>
                <CopyIcon copyText={hash} />
              </Box>
            }
          />
          <TitleItem
            titleWidth="80px"
            title="Proof"
            component={<CssReactJson jsonProps={{ src: proof, collapsed: true }} />}
            sx={{ mt: 1, alignItems: 'flex-start' }}
          />
        </>
      )}
      {callDataProof && (
        <Box sx={{ mt: 1 }}>
          <TitleItem
            titleWidth="80px"
            title="Calldata"
            component={<CssReactJson jsonProps={{ src: callDataProof, collapsed: true }} />}
            sx={{ mt: 1, alignItems: 'flex-start' }}
          />
        </Box>
      )}
    </Box>
  );
}
