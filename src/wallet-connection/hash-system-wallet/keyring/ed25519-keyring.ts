import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from 'micro-key-producer/slip10.js';
import { HDKeyringErrors } from 'src/configs/constance';
import { SerializedHdKeyringState } from 'src/global';
import BaseHashAccount from '../hash-account/base-hash-account';
import Ed25519Account from '../hash-account/ed25519-account';
import BaseKeyring from './base-keyring';

// eslint-disable-next-line quotes
const hdPathString = "m/44'/501'/0'/0'";
const keyType = 'Custom ED25519 Key Tree';

export default class Ed25519Keyring extends BaseKeyring {
  mnemonic: string | undefined | null;
  hdWallet: HDKey | undefined | null;
  masterKey: HDKey | undefined | null;
  accounts: Array<Ed25519Account>;

  constructor() {
    super(keyType, hdPathString);
    this.accounts = [];
  }

  public addKeys(numberOfKeys = 1): Array<BaseHashAccount> {
    if (!this.masterKey) throw new Error(HDKeyringErrors.NoSRPProvided);
    const oldLen = this.accounts.length + 1;
    const newAccounts: Array<BaseHashAccount> = [];
    for (let i = oldLen; i < numberOfKeys + oldLen; i++) {
      const key = this.masterKey.derive(`m/44'/501'/${i}'/0'`).privateKey;
      if (!key) throw new Error(HDKeyringErrors.MissingPrivateKey);
      const _temp = new Ed25519Account(key);
      newAccounts.push(_temp);
      this.accounts.push(_temp);
    }
    return newAccounts;
  }

  initFromMnemonic(mnemonic: string): void {
    if (this.masterKey) throw new Error(HDKeyringErrors.SRPAlreadyProvided);
    this.mnemonic = mnemonic;

    const isValid = bip39.validateMnemonic(this.mnemonic, wordlist);
    if (!isValid) throw new Error(HDKeyringErrors.InvalidSRP);

    const seed = bip39.mnemonicToSeedSync(this.mnemonic, '');
    this.hdWallet = HDKey.fromMasterSeed(Buffer.from(seed).toString('hex'));
    if (!this.pathString) throw new Error(HDKeyringErrors.MissingHdPath);
    this.masterKey = this.hdWallet.derive(this.pathString);
  }

  public serialize(): SerializedHdKeyringState {
    if (!this.mnemonic) throw new Error(HDKeyringErrors.MissingMnemonic);

    const uint8ArrayMnemonic = new TextEncoder().encode(this.mnemonic);

    return {
      mnemonic: Array.from(uint8ArrayMnemonic),
      numberOfKeys: this.accounts.length,
      hdPath: this.pathString,
    };
  }

  public async deserialize(state: SerializedHdKeyringState): Promise<void> {
    if (state.numberOfKeys > 0 && !state.mnemonic)
      throw new Error(HDKeyringErrors.DeserializeErrorNumberOfAccountWithMissingMnemonic);

    if (this.masterKey) throw new Error(HDKeyringErrors.SRPAlreadyProvided);
    const mnemonic = new TextDecoder().decode(new Uint8Array(state.mnemonic));
    this.initFromMnemonic(mnemonic);
    if (state.numberOfKeys > 0) this.addKeys(state.numberOfKeys);
  }
}
