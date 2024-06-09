import { mod } from '@noble/curves/abstract/modular';
import { Hex, bytesToNumberBE, numberToHexUnpadded } from '@noble/curves/abstract/utils';
import { jubjub } from '@noble/curves/jubjub';
import { AccountSignature, PrivateKey } from 'src/global';
import BaseHashAccount from './base-hash-account';

export default class EddsaAccount extends BaseHashAccount {
  private _hexPrivKey: Hex;

  constructor(_privateKey: PrivateKey) {
    super(_privateKey);
    this._hexPrivKey = numberToHexUnpadded(this.normalizedPrivKey);
  }

  _normalizedPrivKey() {
    let bigIntPrivateKey = this.privateKey;
    if (bigIntPrivateKey instanceof Uint8Array)
      bigIntPrivateKey = bytesToNumberBE(bigIntPrivateKey);
    return mod(bigIntPrivateKey, jubjub.CURVE.n);
  }

  getPublicKey() {
    return jubjub.getPublicKey(this._hexPrivKey);
  }

  sign(message: Uint8Array): AccountSignature {
    const signature = jubjub.sign(message, this._hexPrivKey);
    const r = Buffer.from(signature.slice(0, 32));
    const s = Buffer.from(signature.slice(32, 64));
    return { raw: signature, r, s };
  }

  verify(signature: AccountSignature, message: Uint8Array): boolean {
    return jubjub.verify(signature.raw, message, this.publicKey);
  }
}
