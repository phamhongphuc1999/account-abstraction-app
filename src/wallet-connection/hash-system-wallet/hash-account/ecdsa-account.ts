import { mod } from '@noble/curves/abstract/modular';
import { bytesToNumberBE } from '@noble/curves/abstract/utils';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { AccountSignature, PrivateKey } from 'src/global';
import BaseHashAccount from './base-hash-account';

export default class EcdsaAccount extends BaseHashAccount {
  constructor(_privateKey: PrivateKey) {
    super(_privateKey, 'ecdsa');
  }

  _normalizedPrivKey() {
    let bigIntPrivateKey = this.privateKey;
    if (bigIntPrivateKey instanceof Uint8Array)
      bigIntPrivateKey = bytesToNumberBE(bigIntPrivateKey);
    return mod(bigIntPrivateKey, secp256k1.CURVE.n);
  }

  getPublicKey() {
    return secp256k1.getPublicKey(this.normalizedPrivKey);
  }

  sign(message: Uint8Array): AccountSignature {
    const msgHash = Buffer.from(keccak_256(message));
    const sig = secp256k1.sign(msgHash, this.normalizedPrivKey);
    const buf = sig.toCompactRawBytes();
    const r = Buffer.from(buf.slice(0, 32));
    const s = Buffer.from(buf.slice(32, 64));
    const v = BigInt((sig.recovery || 0) + 27);
    return { raw: buf, r, s, v };
  }

  verify(signature: AccountSignature, message: Uint8Array): boolean {
    const sig = {
      r: schnorr.utils.bytesToNumberBE(signature.r),
      s: schnorr.utils.bytesToNumberBE(signature.s),
      recovery: signature.v ? Number(signature.v) - 27 : 0,
    };
    const msgHash = Buffer.from(keccak_256(message));

    return secp256k1.verify(sig, msgHash, this.publicKey);
  }
}
