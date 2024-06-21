import { BabyJub, Eddsa, Point, Signature } from 'circomlibjs';
import { JubSignatureType } from 'src/global';
import { decodeUTF8 } from 'tweetnacl-util';

export default class BJJAccount {
  readonly pubKey: Point;
  readonly privateKey: Uint8Array;
  public eddsa: Eddsa;
  public babyJub: BabyJub;

  constructor(_eddsa: Eddsa, _babyJub: BabyJub, _privateKey: Uint8Array) {
    this.eddsa = _eddsa;
    this.babyJub = _babyJub;

    this.pubKey = this.eddsa.prv2pub(_privateKey);
    this.privateKey = _privateKey;
  }

  sign(message: string): JubSignatureType {
    const messageBytes = decodeUTF8(message);
    const signature = this.eddsa.signPedersen(this.privateKey, messageBytes);
    const pSignature = this.eddsa.packSignature(signature);
    const uSignature = this.eddsa.unpackSignature(pSignature);
    return { raw: signature, p: pSignature, u: uSignature };
  }

  verify(message: string, uSignature: Signature): boolean {
    const messageBytes = decodeUTF8(message);
    return this.eddsa.verifyPedersen(messageBytes, uSignature, this.pubKey);
  }
}
