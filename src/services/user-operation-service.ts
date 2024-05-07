/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AbiCoder,
  BytesLike,
  Signer,
  Wallet,
  ZeroAddress,
  concat,
  getBytes,
  hexlify,
  keccak256,
  zeroPadValue,
} from 'ethers';
import { PackedUserOperation, UserOperation } from 'src/global';

export default class UserOperationService {
  static packAccountGasLimits(verificationGasLimit: BytesLike, callGasLimit: BytesLike): string {
    return concat([
      zeroPadValue(hexlify(verificationGasLimit), 16),
      zeroPadValue(hexlify(callGasLimit), 16),
    ]);
  }

  static packPaymasterData(
    paymaster: string,
    paymasterVerificationGasLimit: BytesLike,
    postOpGasLimit: BytesLike,
    paymasterData: string
  ): string {
    return concat([
      paymaster,
      zeroPadValue(hexlify(paymasterVerificationGasLimit), 16),
      zeroPadValue(hexlify(postOpGasLimit), 16),
      paymasterData,
    ]);
  }

  static packUserOp(userOp: UserOperation): PackedUserOperation {
    const accountGasLimits = this.packAccountGasLimits(
      userOp.verificationGasLimit,
      userOp.callGasLimit
    );
    const gasFees = this.packAccountGasLimits(userOp.maxPriorityFeePerGas, userOp.maxFeePerGas);
    let paymasterAndData = '0x';
    if (userOp.paymaster?.length >= 20 && userOp.paymaster !== ZeroAddress) {
      paymasterAndData = this.packPaymasterData(
        userOp.paymaster as string,
        userOp.paymasterVerificationGasLimit,
        userOp.paymasterPostOpGasLimit,
        userOp.paymasterData as string
      );
    }
    return {
      sender: userOp.sender,
      nonce: userOp.nonce,
      callData: userOp.callData,
      accountGasLimits,
      initCode: userOp.initCode,
      preVerificationGas: userOp.preVerificationGas,
      gasFees,
      paymasterAndData,
      signature: userOp.signature,
    };
  }

  static encodeUserOp(userOp: UserOperation, forSignature = true): string {
    const packedUserOp = this.packUserOp(userOp);
    if (forSignature) {
      return AbiCoder.defaultAbiCoder().encode(
        ['address', 'uint256', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'bytes32'],
        [
          packedUserOp.sender,
          packedUserOp.nonce,
          keccak256(packedUserOp.initCode),
          keccak256(packedUserOp.callData),
          packedUserOp.accountGasLimits,
          packedUserOp.preVerificationGas,
          packedUserOp.gasFees,
          keccak256(packedUserOp.paymasterAndData),
        ]
      );
    } else {
      // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
      return AbiCoder.defaultAbiCoder().encode(
        ['address', 'uint256', 'bytes', 'bytes', 'bytes32', 'uint256', 'bytes32', 'bytes', 'bytes'],
        [
          packedUserOp.sender,
          packedUserOp.nonce,
          packedUserOp.initCode,
          packedUserOp.callData,
          packedUserOp.accountGasLimits,
          packedUserOp.preVerificationGas,
          packedUserOp.gasFees,
          packedUserOp.paymasterAndData,
          packedUserOp.signature,
        ]
      );
    }
  }

  static getUserOpHash(op: UserOperation, entryPoint: string, chainId: number): string {
    const userOpHash = keccak256(this.encodeUserOp(op, true));
    const enc = AbiCoder.defaultAbiCoder().encode(
      ['bytes32', 'address', 'uint256'],
      [userOpHash, entryPoint, chainId]
    );
    return keccak256(enc);
  }

  static async signUserOp(
    chainId: number,
    entryPointAddress: string,
    op: Omit<UserOperation, 'signature'>,
    signer: Wallet | Signer
  ) {
    const _op = { ...op, signature: '' };
    const message = getBytes(this.getUserOpHash(_op, entryPointAddress, chainId));
    let signature;
    try {
      signature = await signer.signMessage(message);
    } catch (err: any) {
      signature = await (signer as any)._legacySignMessage(message);
    }
    return { ..._op, signature };
  }

  static async signAndPack(
    chainId: number,
    entryPointAddress: string,
    op: Omit<UserOperation, 'signature'>,
    signer: Wallet | Signer
  ) {
    const signedOp = await this.signUserOp(chainId, entryPointAddress, op, signer);
    return this.packUserOp(signedOp);
  }
}
