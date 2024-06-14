import { bufferToHex } from '@ethereumjs/util';
import { mod } from '@noble/curves/abstract/modular';
import { bytesToNumberBE, numberToHexUnpadded } from '@noble/curves/abstract/utils';
import { ed25519 } from '@noble/curves/ed25519';
import { AccountSignature, PrivateKey } from 'src/global';
import { decodeUTF8 } from 'tweetnacl-util';
import BaseHashAccount from './base-hash-account';

export default class EddsaAccount extends BaseHashAccount {
  protected normalizedPrivKey: bigint;
  protected hexPrivKey: string;

  constructor(_privateKey: PrivateKey) {
    const _normalizedPrivKey = mod(bytesToNumberBE(_privateKey), ed25519.CURVE.n);
    const _hexPrivKey = numberToHexUnpadded(_normalizedPrivKey);
    const _publicKey = ed25519.getPublicKey(_hexPrivKey);
    super(_privateKey, bufferToHex(Buffer.from(_publicKey)), 'ed25519');
    this.normalizedPrivKey = _normalizedPrivKey;
    this.hexPrivKey = _hexPrivKey;
  }

  sign(message: string): AccountSignature {
    const messageBytes = decodeUTF8(message);
    const signature = ed25519.sign(messageBytes, this.hexPrivKey);
    const r = Buffer.from(signature.slice(0, 32));
    const s = Buffer.from(signature.slice(32, 64));
    return { raw: signature, r, s };
  }

  verify(signature: AccountSignature, message: string) {
    const messageBytes = decodeUTF8(message);
    return ed25519.verify(signature.raw, messageBytes, this.publicKey);
  }
}
