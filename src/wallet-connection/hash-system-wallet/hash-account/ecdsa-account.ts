import { bufferToHex, publicToAddress } from '@ethereumjs/util';
import { mod } from '@noble/curves/abstract/modular';
import { bytesToNumberBE } from '@noble/curves/abstract/utils';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import { AccountSignature, PrivateKey } from 'src/global';
import { decodeUTF8 } from 'tweetnacl-util';
import BaseHashAccount from './base-hash-account';

export default class EcdsaAccount extends BaseHashAccount {
  protected normalizedPrivKey: bigint;

  constructor(_privateKey: PrivateKey) {
    const _normalizedPrivKey = mod(bytesToNumberBE(_privateKey), secp256k1.CURVE.n);
    const _publicKey = secp256k1.getPublicKey(_normalizedPrivKey);
    super(_privateKey, bufferToHex(publicToAddress(Buffer.from(_publicKey), true)), 'ecdsa');
    this.normalizedPrivKey = _normalizedPrivKey;
  }

  sign(message: string): AccountSignature {
    const messageBytes = decodeUTF8(message);
    const msgHash = Buffer.from(keccak_256(messageBytes));
    const sig = secp256k1.sign(msgHash, this.normalizedPrivKey);
    const buf = sig.toCompactRawBytes();
    const r = Buffer.from(buf.slice(0, 32));
    const s = Buffer.from(buf.slice(32, 64));
    const v = BigInt((sig.recovery || 0) + 27);
    return { raw: buf, r, s, v };
  }

  verify(signature: AccountSignature, message: string): boolean {
    const messageBytes = decodeUTF8(message);
    const sig = {
      r: schnorr.utils.bytesToNumberBE(signature.r),
      s: schnorr.utils.bytesToNumberBE(signature.s),
      recovery: signature.v ? Number(signature.v) - 27 : 0,
    };
    const msgHash = Buffer.from(keccak_256(messageBytes));
    return secp256k1.verify(sig, msgHash, this.publicKey);
  }
}
