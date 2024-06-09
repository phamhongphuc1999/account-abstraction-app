/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumberish, InterfaceAbi, JsonRpcProvider, JsonRpcSigner } from 'ethers';

export type StringListType<T = unknown> = { [key: string]: T };

export type WalletType = 'metamask' | 'hash-system';
export type ThemeMode = 'light' | 'dark';
export type StoreName = 'tokens' | 'hashWalletMetadata';
export type ContractType = 'reader' | 'signer';
export type ConnectorType = 'metamask' | 'coinbase';
export type FStatus =
  | 'INITIAL'
  | 'SKIP'
  | 'EXECUTING'
  | 'SUCCESS'
  | 'FAIL'
  | 'UPDATING'
  | 'WAIT_CONFIRM';
export type DeployStatus = 'initial' | 'deployed' | 'notDeploy';
export type AccountType = 'owner' | 'accountAbstraction';

export type AddressesType = {
  ENTRY_POINT_ADDRESS: string;
  ACCOUNT_FACTORY_ADDRESS: string;
  MULTI_CALL_ADDRESS: string;
};
export type AddressesListType = { [chainId: number]: AddressesType };

export type GuardianHashType = {
  address: string;
  hash: string;
};
export type GuardianHashListType = { [address: string]: GuardianHashType };
export type GuardianOwnTransactionType = {
  index: number;
  value: number;
  data: string;
  eta: number;
  executedType: number;
  type: number;
};

export interface Connector {
  image: string;
  type: ConnectorType;
  name: string;
}
export type ConnectorListType = {
  [id in ConnectorType]: Connector;
};

export interface NativeToken {
  name: string;
  symbol: string;
  decimals: number;
}

export type StandardToken = {
  address: string;
  symbol: string;
  decimal: number;
};

export interface ActionToken extends StandardToken {
  image: string | [string, string];
}

export type Chain = {
  name: string;
  nativeCurrency: NativeToken;
  chainId: number;
  image: string;
  explorers: Array<string>;
  urls: Array<string>;
  bundlers: Array<string>;
};

export type ChainList = StringListType<Chain>;
export type GlobalProviderType = JsonRpcProvider | JsonRpcSigner;

export type MultiCallType = {
  address: string;
  name: string;
  params: Array<any>;
};

export interface MultiCallParams {
  abi: InterfaceAbi;
  calls: Array<MultiCallType>;
  reader: JsonRpcProvider;
}

export interface ProofCallDataType {
  pA: [BigNumberish, BigNumberish];
  pB: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
  pC: [BigNumberish, BigNumberish];
  pubSignals: [BigNumberish, BigNumberish];
}

/* hash system wallet types */
export type SignatureScheme = 'ecdsa_secp256k1' | 'eddsa_babyjubjub';

export type PrivateKey = Uint8Array | bigint;
export type PublicKey = Uint8Array;

export type AccountSignature = {
  raw: Uint8Array;
  r: Buffer;
  s: Buffer;
  v?: bigint;
};

export type SerializedHdKeyringState = {
  mnemonic: Array<number>;
  schemas: Array<SignatureScheme>;
  hdPath?: string;
};
/* end hash system wallet types */
