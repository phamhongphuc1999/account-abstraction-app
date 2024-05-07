import { BigNumberish, BytesLike, JsonRpcProvider, JsonRpcSigner } from 'ethers';

export type StringListType<T = unknown> = { [key: string]: T };

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

export type AddressesType = {
  ENTRY_POINT_ADDRESS: string;
  ACCOUNT_FACTORY_ADDRESS: string;
};
export type AddressesListType = { [chainId: number]: AddressesType };

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
};

export type ChainList = StringListType<Chain>;
export type GlobalProviderType = JsonRpcProvider | JsonRpcSigner;

export type address = string;
export type uint256 = BigNumberish;
export type uint = BigNumberish;
export type uint48 = BigNumberish;
export type uint128 = BigNumberish;
export type bytes = BytesLike;
export type bytes32 = BytesLike;

export interface UserOperation {
  sender: address;
  nonce: uint256;
  initCode: bytes;
  callData: bytes;
  callGasLimit: BytesLike;
  verificationGasLimit: BytesLike;
  preVerificationGas: uint256;
  maxFeePerGas: BytesLike;
  maxPriorityFeePerGas: BytesLike;
  paymaster: address;
  paymasterVerificationGasLimit: BytesLike;
  paymasterPostOpGasLimit: BytesLike;
  paymasterData: bytes;
  signature: bytes;
}

export interface PackedUserOperation {
  sender: address;
  nonce: uint256;
  initCode: bytes;
  callData: bytes;
  accountGasLimits: bytes32;
  preVerificationGas: uint256;
  gasFees: bytes32;
  paymasterAndData: bytes;
  signature: bytes;
}
