import { bufferToHex, publicToAddress } from '@ethereumjs/util';
import { Hex, numberToHexUnpadded } from '@noble/curves/abstract/utils';
import { AccountSignature, PrivateKey, PublicKey, SignatureScheme } from 'src/global';

export default abstract class BaseHashAccount {
  public signatureType: SignatureScheme;

  public privateKey: PrivateKey;
  public normalizedPrivKey: bigint;
  protected _hexPrivKey: Hex;
  public publicKey: PublicKey;

  constructor(_privateKey: PrivateKey, _signatureType: SignatureScheme = 'ed25519') {
    this.signatureType = _signatureType;

    this.privateKey = _privateKey;
    this.normalizedPrivKey = this._normalizedPrivKey();
    this._hexPrivKey = numberToHexUnpadded(this.normalizedPrivKey);
    this.publicKey = this.getPublicKey();
  }

  public getEVMAddress(): string {
    return bufferToHex(publicToAddress(Buffer.from(this.publicKey), true)).toLowerCase();
  }

  protected abstract _normalizedPrivKey(): bigint;
  abstract getPublicKey(): PublicKey;
  abstract sign(message: Uint8Array): AccountSignature;
  abstract verify(signature: AccountSignature, message: Uint8Array): boolean;
}
