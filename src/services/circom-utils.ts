import { buildPoseidon } from 'circomlibjs';
import { Groth16Proof, PublicSignals, groth16 } from 'snarkjs';
import { ProofCallDataType } from 'src/global';
import VerificationKey from './verification_key.json';

export async function generatePoseidonHash(
  _address: string,
  mode: 'normal' | 'hex' = 'normal'
): Promise<string> {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  const res2 = poseidon([_address]);
  return mode == 'normal' ? String(F.toObject(res2)) : `0x${String(F.toObject(res2).toString(16))}`;
}

export async function generateProof(_address: string): Promise<{
  proof: Groth16Proof;
  publicSignals: PublicSignals;
}> {
  const _hash = await generatePoseidonHash(_address);
  const { proof, publicSignals } = await groth16.fullProve(
    { address: _address, hash: _hash },
    '/public/circom/sha_js/sha.wasm',
    '/public/circom/sha1.zkey'
  );
  return { proof, publicSignals };
}

export async function verifyProof(
  proof: Groth16Proof,
  publicSignals: PublicSignals
): Promise<boolean> {
  const res = await groth16.verify(VerificationKey, publicSignals, proof);
  return res;
}

export async function generateCalldata(
  proof: Groth16Proof,
  publicSignals: PublicSignals
): Promise<ProofCallDataType> {
  const _call = await groth16.exportSolidityCallData(proof, publicSignals);
  const realCall = JSON.parse(`[${_call}]`) as [
    ProofCallDataType['pA'],
    ProofCallDataType['pB'],
    ProofCallDataType['pC'],
    ProofCallDataType['pubSignals']
  ];
  return { pA: realCall[0], pB: realCall[1], pC: realCall[2], pubSignals: realCall[3] };
}
