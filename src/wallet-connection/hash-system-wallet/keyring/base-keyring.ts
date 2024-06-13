import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { SerializedHdKeyringState, SignatureScheme } from 'src/global';
import BaseHashAccount from '../hash-account/base-hash-account';

export default abstract class BaseKeyring<State = SerializedHdKeyringState> {
  readonly keyType: string;
  readonly pathString: string;
  readonly signatureSchema: SignatureScheme;

  constructor(
    _keyType: string,
    _pathString: string,
    _signatureSchema: SignatureScheme = 'ed25519'
  ) {
    this.keyType = _keyType;
    this.pathString = _pathString;
    this.signatureSchema = _signatureSchema;
  }

  static generateRandomMnemonic() {
    return bip39.generateMnemonic(wordlist, 128);
  }

  abstract addKeys(numberOfKeys?: number): Array<BaseHashAccount>;
  abstract initFromMnemonic(mnemonic: string): void;

  // Serialize the keyring state as a JSON-serializable object.
  abstract serialize(): State;

  // Deserialize the given keyring state, overwriting any existing state with the serialized state provided.
  abstract deserialize(state: State): void;
}
