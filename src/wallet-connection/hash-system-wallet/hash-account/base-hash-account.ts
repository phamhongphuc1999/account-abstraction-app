import { AccountSignature, PrivateKey, PublicKey, SignatureScheme } from 'src/global';

export default abstract class BaseHashAccount {
  public signatureType: SignatureScheme;

  public privateKey: PrivateKey;
  public normalizedPrivKey: bigint;
  public publicKey: PublicKey;

  constructor(_privateKey: PrivateKey, _signatureType: SignatureScheme = 'eddsa_babyjubjub') {
    this.signatureType = _signatureType;

    this.privateKey = _privateKey;
    this.normalizedPrivKey = this._normalizedPrivKey();
    this.publicKey = this.getPublicKey();
  }

  protected abstract _normalizedPrivKey(): bigint;
  abstract getPublicKey(): PublicKey;
  abstract sign(message: Uint8Array): AccountSignature;
  abstract verify(signature: AccountSignature, message: Uint8Array): boolean;
}
