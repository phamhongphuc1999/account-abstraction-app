import { Point, buildBabyjub, buildEddsa, buildPoseidon } from 'circomlibjs';
import { BigNumberish } from 'ethers';
import { Groth16Proof, PublicSignals, groth16 } from 'snarkjs';
import { HexType, JubProofType, ProofCallDataType, ProofPoint } from 'src/global';
import { convertBigIntsToNumber } from '.';
import VerificationKey from './verification_key.json';

export function makeVerifiedInput(recoveredAddress: string, increment: string) {
  let excludedAddress = recoveredAddress.toLowerCase();
  if (excludedAddress.slice(0, 2) == '0x') excludedAddress = excludedAddress.slice(2);
  while (excludedAddress.length < 48) excludedAddress = `0${excludedAddress}`;
  let sIncrement = parseInt(increment).toString(16);
  while (sIncrement.length < 16) sIncrement = `0${sIncrement}`;
  return `${sIncrement}${excludedAddress}`;
}

export function buffer2bits(buff: Uint8Array) {
  const res = [];
  for (let i = 0; i < buff.length; i++) {
    for (let j = 0; j < 8; j++) {
      if ((buff[i] >> j) & 1) res.push(1n);
      else res.push(0n);
    }
  }
  return res;
}

export async function generatePoseidonHash(
  _address: string,
  mode: HexType = 'normal'
): Promise<string> {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;
  const res2 = poseidon([_address]);
  return mode == 'normal' ? String(F.toObject(res2)) : `0x${String(F.toObject(res2).toString(16))}`;
}

export async function getHexPublicKey(pubKey: Point) {
  const babyJub = await buildBabyjub();
  const pPubKey = babyJub.packPoint(pubKey);
  const aBits = buffer2bits(pPubKey);
  return convertBigIntsToNumber(aBits, 256, 'hex');
}

export async function generateWitness(message: string, privateKey: Uint8Array) {
  const eddsa = await buildEddsa();
  const babyJub = await buildBabyjub();
  const messageBytes = Buffer.from(message, 'hex');
  const signature = eddsa.signPedersen(privateKey, messageBytes);
  const pSignature = eddsa.packSignature(signature);
  const msgBits = buffer2bits(messageBytes);
  const r8Bits = buffer2bits(pSignature.slice(0, 32));
  const sBits = buffer2bits(pSignature.slice(32, 64));
  const pubKey = eddsa.prv2pub(privateKey);
  const pPubKey = babyJub.packPoint(pubKey);
  const aBits = buffer2bits(pPubKey);
  return { A: aBits, R8: r8Bits, S: sBits, msg: msgBits };
}

function convertBigintArray(_arr: Array<bigint>) {
  return _arr.map((item) => item.toString());
}
export function convertJubProof(proof: JubProofType) {
  const { A, R8, S, msg } = proof;
  return {
    A: convertBigintArray(A),
    R8: convertBigintArray(R8),
    S: convertBigintArray(S),
    msg: convertBigintArray(msg),
  };
}

export async function generateProof(
  message: string,
  privateKey: Uint8Array
): Promise<{ proof: Groth16Proof; publicSignals: PublicSignals }> {
  const { A, R8, S, msg } = await generateWitness(message, privateKey);
  const { proof, publicSignals } = await groth16.fullProve(
    { msg, A, R8, S },
    '/public/circom/jubjub_js/jubjub.wasm',
    '/public/circom/jubjub1.zkey'
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
    ProofPoint,
    [ProofPoint, ProofPoint],
    ProofPoint,
    [BigNumberish, BigNumberish, BigNumberish]
  ];
  return { pA: realCall[0], pB: realCall[1], pC: realCall[2], pubSignals: realCall[3] };
}
