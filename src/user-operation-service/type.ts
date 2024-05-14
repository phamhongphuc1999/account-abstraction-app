/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumberish, BytesLike } from 'ethers';

export type address = string;
export type uint256 = BigNumberish;
export type uint = BigNumberish;
export type uint48 = BigNumberish;
export type bytes = BytesLike;
export type bytes32 = BytesLike;

type CoreUserOperation = {
  sender: address;
  nonce: uint256;
  callData: bytes;
  signature: bytes;
};

type ExtendUserOperation = {
  initCode: bytes;
  callGasLimit: uint256;
  verificationGasLimit: uint256;
  preVerificationGas: uint256;
  maxFeePerGas: uint256;
  maxPriorityFeePerGas: uint256;
  paymasterAndData: bytes;
};

export type RawUserOperation = CoreUserOperation & Partial<ExtendUserOperation>;
export type UnSignUserOperation = Omit<CoreUserOperation, 'signature'> & ExtendUserOperation;
export type UserOperation = CoreUserOperation & ExtendUserOperation;

export enum ReputationStatus {
  OK,
  THROTTLED,
  BANNED,
}

export interface ReputationEntry {
  address: string;
  opsSeen: number;
  opsIncluded: number;
  status?: ReputationStatus;
}

export type UserOpRequestType = {
  id: string;
  jsonrpc: string;
  method: UserOpMethodId;
  params: Array<any>;
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
