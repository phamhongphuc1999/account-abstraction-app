import { Typography } from '@mui/material';
import { isAddress } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { Groth16Proof, PublicSignals } from 'snarkjs';
import TitleItem from 'src/components/title-item';
import { ProofCallDataType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/hook';
import { generateCalldata, generateProof, verifyProof } from 'src/services/circom-utils';

export default function GuardianRecovery() {
  const [proof, setProof] = useState<Groth16Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const [callDataProof, setCallDataProof] = useState<ProofCallDataType | null>(null);
  console.error(publicSignals, callDataProof);
  const { ownerAddress } = useAppSelector((state) => state.user);

  const _generate = useCallback(async () => {
    if (isAddress(ownerAddress)) {
      try {
        const _proof = await generateProof(ownerAddress);
        setProof(_proof.proof);
        setPublicSignals(_proof.publicSignals);
        const verify = await verifyProof(_proof.proof, _proof.publicSignals);
        if (verify) {
          const _callDataProof = await generateCalldata(_proof.proof, _proof.publicSignals);
          setCallDataProof(_callDataProof);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [ownerAddress]);

  useEffect(() => {
    _generate();
  }, [_generate]);

  return (
    <>
      {proof && (
        <>
          <TitleItem title="Protocol" component={<Typography>{proof.protocol}</Typography>} />
        </>
      )}
    </>
  );
}
