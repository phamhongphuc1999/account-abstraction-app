import { HDKey } from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKeyringErrors } from 'src/configs/constance';
import { PrivateKey, SerializedHdKeyringState, SignatureScheme } from 'src/global';
import BaseHashAccount from '../hash-account/base-hash-account';
import EcdsaAccount from '../hash-account/ecdsa-account';
import EddsaAccount from '../hash-account/eddsa-account';
import BaseKeyring from './base-keyring';

// eslint-disable-next-line quotes
const hdPathString = "m/44'/60'/0'/0";
const keyType = 'Custom HD Key Tree';

export default class HDKeyring extends BaseKeyring {
  mnemonic: string | undefined | null;
  hdWallet: HDKey | undefined | null;
  masterKey: HDKey | undefined | null;
  accounts: Array<BaseHashAccount>;

  constructor() {
    super(keyType, hdPathString);
    this.accounts = [];
  }

  public addKeys(schemas: Array<SignatureScheme>): Array<PrivateKey> {
    if (!this.masterKey) throw new Error(HDKeyringErrors.NoSRPProvided);
    const oldLen = this.accounts.length;
    const newKeys: Array<PrivateKey> = [];
    let counter = 0;
    for (let i = oldLen; i < schemas.length + oldLen; i++) {
      const key = this.masterKey.deriveChild(i).privateKey;
      if (!key) throw new Error(HDKeyringErrors.MissingPrivateKey);
      newKeys.push(key);
      this.accounts.push(
        schemas[counter] == 'ecdsa_secp256k1' ? new EcdsaAccount(key) : new EddsaAccount(key)
      );
      counter++;
    }
    return newKeys;
  }

  initFromMnemonic(mnemonic: string) {
    if (this.masterKey) throw new Error(HDKeyringErrors.SRPAlreadyProvided);
    this.mnemonic = mnemonic;

    // validate before initializing
    const isValid = bip39.validateMnemonic(this.mnemonic, wordlist);
    if (!isValid) throw new Error(HDKeyringErrors.InvalidSRP);

    // FIXME support other mnemonic type
    const seed = bip39.mnemonicToSeedSync(this.mnemonic);
    this.hdWallet = HDKey.fromMasterSeed(seed);
    if (!this.pathString) throw new Error(HDKeyringErrors.MissingHdPath);
    this.masterKey = this.hdWallet.derive(this.pathString);
  }

  public getSchemas(): Array<SignatureScheme> {
    return this.accounts.map((account) => account.signatureType);
  }

  public serialize(): SerializedHdKeyringState {
    if (!this.mnemonic) throw new Error(HDKeyringErrors.MissingMnemonic);
    const uint8ArrayMnemonic = new TextEncoder().encode(this.mnemonic);

    return {
      mnemonic: Array.from(uint8ArrayMnemonic),
      schemas: this.getSchemas(),
      hdPath: this.pathString,
    };
  }

  public async deserialize(state: SerializedHdKeyringState): Promise<void> {
    if (state.schemas.length > 0 && !state.mnemonic)
      throw new Error(HDKeyringErrors.DeserializeErrorNumberOfAccountWithMissingMnemonic);

    if (this.masterKey) throw new Error(HDKeyringErrors.SRPAlreadyProvided);
    const mnemonic = new TextDecoder().decode(new Uint8Array(state.mnemonic));
    this.initFromMnemonic(mnemonic);
    if (state.schemas.length > 0) this.addKeys(state.schemas);
  }
}
