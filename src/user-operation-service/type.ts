/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumberish, BytesLike } from 'ethers';

export type address = string;
export type uint256 = BigNumberish;
export type uint = BigNumberish;
export type uint48 = BigNumberish;
export type uint128 = BigNumberish;
export type bytes = BytesLike;
export type bytes32 = BytesLike;

type ExtendUserOperation = {
  initCode: bytes;
  callGasLimit: BytesLike;
  verificationGasLimit: BytesLike;
  preVerificationGas: uint256;
  maxFeePerGas: BytesLike;
  maxPriorityFeePerGas: BytesLike;
  paymaster: address;
  paymasterVerificationGasLimit: BytesLike;
  paymasterPostOpGasLimit: BytesLike;
  paymasterData: bytes;
};

type CoreUserOperation = {
  sender: address;
  nonce: uint256;
  callData: bytes;
  signature: bytes;
};

export type RawUserOperation = CoreUserOperation & Partial<ExtendUserOperation>;
export type UserOperation = CoreUserOperation & ExtendUserOperation;

export interface PackedUserOperation extends CoreUserOperation {
  initCode: bytes;
  accountGasLimits: bytes32;
  preVerificationGas: uint256;
  gasFees: bytes32;
  paymasterAndData: bytes;
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

export enum ReputationStatus {
  OK,
  THROTTLED,
  BANNED,
}

export type ReputationEntry = {
  address: string;
  opsSeen: number;
  opsIncluded: number;
  status?: ReputationStatus;
};

export interface GasOverheads {
  fixed: number;
  perUserOp: number;
  perUserOpWord: number;
  zeroByte: number;
  nonZeroByte: number;
  bundleSize: number;
  sigSize: number;
}
