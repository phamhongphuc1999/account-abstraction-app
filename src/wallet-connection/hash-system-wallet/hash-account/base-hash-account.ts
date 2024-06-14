import { AccountSignature, PrivateKey, PublicKey, SignatureScheme } from 'src/global';

export default abstract class BaseHashAccount {
  public readonly schema: SignatureScheme;
  public readonly publicKey: PublicKey;
  protected readonly privKey: PrivateKey;

  constructor(_privateKey: PrivateKey, _publicKey: PublicKey, _signatureType: SignatureScheme) {
    this.privKey = _privateKey;
    this.publicKey = _publicKey;
    this.schema = _signatureType;
  }

  abstract sign(message: string): AccountSignature;
  abstract verify(signature: AccountSignature, message: string): boolean;
}
