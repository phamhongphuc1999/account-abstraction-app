/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumberish, BytesLike } from 'ethers';

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

export type UserOpMethodId =
  | 'eth_chainId'
  | 'eth_supportedEntryPoints'
  | 'eth_sendUserOperation'
  | 'eth_estimateUserOperationGas'
  | 'eth_getUserOperationReceipt'
  | 'eth_getUserOperationByHash'
  | 'web3_clientVersion'
  | 'debug_bundler_clearState'
  | 'debug_bundler_dumpMempool'
  | 'debug_bundler_clearMempool'
  | 'debug_bundler_setReputation'
  | 'debug_bundler_dumpReputation'
  | 'debug_bundler_clearReputation'
  | 'debug_bundler_setBundlingMode'
  | 'debug_bundler_setBundleInterval'
  | 'debug_bundler_sendBundleNow'
  | 'debug_bundler_getStakeStatus';

export type UserOpRequestType = {
  id: string;
  jsonrpc: string;
  method: UserOpMethodId;
  params: Array<any>;
};
