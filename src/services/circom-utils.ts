/* eslint-disable @typescript-eslint/no-var-requires */
import { Groth16Proof, PublicSignals, groth16 } from 'snarkjs';
import VerificationKey from './circom/verification_key.json';
import { buildPoseidon } from 'circomlibjs';

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
    './circom/sha_js/sha.wasm',
    './circom/sha1.zkey'
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
