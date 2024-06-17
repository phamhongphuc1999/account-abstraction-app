import { BabyJub, Eddsa, Point, Signature } from 'circomlibjs';
import { decodeUTF8 } from 'tweetnacl-util';

function buffer2bits(buff: Uint8Array) {
  const res = [];
  for (let i = 0; i < buff.length; i++) {
    for (let j = 0; j < 8; j++) {
      if ((buff[i] >> j) & 1) res.push(1n);
      else res.push(0n);
    }
  }
  return res;
}

export type JubSignatureType = { raw: Signature; p: Uint8Array; u: Signature };

export default class BabyjubAccount {
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

  proof(message: string, pSignature: Uint8Array) {
    const messageBytes = decodeUTF8(message);
    const msgBits = buffer2bits(messageBytes);
    const r8Bits = buffer2bits(pSignature.slice(0, 32));
    const sBits = buffer2bits(pSignature.slice(32, 64));
    const pPubKey = this.babyJub.packPoint(this.pubKey);
    const aBits = buffer2bits(pPubKey);
    return { A: aBits, R8: r8Bits, S: sBits, msg: msgBits };
  }
}
