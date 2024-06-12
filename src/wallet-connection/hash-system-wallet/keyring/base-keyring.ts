import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { PrivateKey, SerializedHdKeyringState } from 'src/global';

export default abstract class BaseKeyring<State = SerializedHdKeyringState> {
  readonly keyType: string;
  readonly pathString: string;

  constructor(_keyType: string, _pathString: string) {
    this.keyType = _keyType;
    this.pathString = _pathString;
  }

  static generateRandomMnemonic() {
    return bip39.generateMnemonic(wordlist);
  }

  abstract addKeys(numberOfKeys: number): Array<PrivateKey>;
  abstract initFromMnemonic(mnemonic: string): void;

  // Serialize the keyring state as a JSON-serializable object.
  abstract serialize(): State;

  // Deserialize the given keyring state, overwriting any existing state with the serialized state provided.
  abstract deserialize(state: State): void;
}
