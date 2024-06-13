import { useEffect } from 'react';
import LoginForm from 'src/pages-view/login/login-form';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import HDKey from 'micro-key-producer/slip10.js';

export default function Login() {
  useEffect(() => {
    const mnemonic = bip39.generateMnemonic(wordlist, 128);
    const seed = bip39.mnemonicToSeedSync(mnemonic, '');
    const hdWallet = HDKey.fromMasterSeed(Buffer.from(seed).toString('hex'));
    // eslint-disable-next-line quotes
    hdWallet.derive("m/44'/501'/0'/0'");
  }, []);

  return (
    <>
      <LoginForm />
    </>
  );
}
