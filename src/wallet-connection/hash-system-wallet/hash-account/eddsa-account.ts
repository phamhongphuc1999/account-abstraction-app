import { mod } from '@noble/curves/abstract/modular';
import { bytesToNumberBE } from '@noble/curves/abstract/utils';
import { ed25519 } from '@noble/curves/ed25519';
import { AccountSignature, PrivateKey } from 'src/global';
import BaseHashAccount from './base-hash-account';

export default class EddsaAccount extends BaseHashAccount {
  constructor(_privateKey: PrivateKey) {
    super(_privateKey);
  }

  _normalizedPrivKey() {
    let bigIntPrivateKey = this.privateKey;
    if (bigIntPrivateKey instanceof Uint8Array)
      bigIntPrivateKey = bytesToNumberBE(bigIntPrivateKey);
    return mod(bigIntPrivateKey, ed25519.CURVE.n);
  }

  getPublicKey() {
    return ed25519.getPublicKey(this._hexPrivKey);
  }

  sign(message: Uint8Array): AccountSignature {
    const signature = ed25519.sign(message, this._hexPrivKey);
    const r = Buffer.from(signature.slice(0, 32));
    const s = Buffer.from(signature.slice(32, 64));
    return { raw: signature, r, s };
  }

  verify(signature: AccountSignature, message: Uint8Array): boolean {
    return ed25519.verify(signature.raw, message, this.publicKey);
  }
}
