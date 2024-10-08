import { ZeroAddress } from 'ethers';
import BSC from 'src/assets/images/tokens/bnb.svg';
import { GasOverheads, UserOperation } from 'src/user-operation-service/type';

export const HARDCODE_PASSWORD = '1111';
export const LS = {
  THEME: 'theme',
};

export const ChainConfig = [
  { chainId: 56, image: BSC, name: 'BSC Mainnet' },
  { chainId: 97, image: BSC, name: 'BSC Testnet' },
];
export const OwnerExecutedType = {
  Queue: 0,
  Success: 1,
  Fail: 2,
  Cancel: 3,
};
export const OwnerTransactionType = {
  AddGuardian: 0,
  RemoveGuardian: 1,
  SetThreshold: 2,
};

export const DAY_SECOND = 86400;
export const SIMPLE_SALT = '0x'.padEnd(66, '0');
export const TX_SEND_FEE = '0.000000003';
export const SIMPLE_EXTEND = 100;

export const DefaultsForUserOp: UserOperation = {
  sender: ZeroAddress,
  nonce: 0,
  initCode: '0x',
  callData: '0x',
  callGasLimit: 0,
  verificationGasLimit: 150000, // default verification gas. will add create2 cost (3200+200*length) if initCode exists
  preVerificationGas: 21000, // should also cover calldata cost.
  maxFeePerGas: 0,
  maxPriorityFeePerGas: 1e9,
  paymasterAndData: '0x',
  signature: '0x',
};

export const DefaultGasOverheads: GasOverheads = {
  fixed: 21000,
  perUserOp: 18300,
  perUserOpWord: 4,
  zeroByte: 4,
  nonZeroByte: 16,
  bundleSize: 1,
  sigSize: 65,
};

export enum HDKeyringErrors {
  MissingMnemonic = 'HdKeyring: Missing mnemonic when serializing',
  MissingHdPath = 'HdKeyring: Missing hd path',
  MissingPrivateKey = 'HdKeyring: Missing private key in wallet',
  MissingPublicKey = 'HdKeyring: Missing public key in wallet',

  NoSRPProvided = 'HdKeyring: No secret recovery phrase provided',
  InvalidSRP = 'HdKeyring: Invalid secret recovery phrase provided',
  SRPAlreadyProvided = 'HdKeyring: Secret recovery phrase already provided',

  PublicKeyNotFound = 'HdKeyring: Public key not found in this keyring',
  PublicKeyNotProvided = 'HdKeyring: Must specify public key.',

  DeserializeErrorNumberOfAccountWithMissingMnemonic = 'HdKeyring: Deserialize method cannot be called with an opts value for numberOfAccounts and no menmonic',
}
