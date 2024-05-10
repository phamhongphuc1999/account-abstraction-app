/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';
import {
  AbiCoder,
  BytesLike,
  Interface,
  JsonRpcProvider,
  Signer,
  Wallet,
  ZeroAddress,
  concat,
  dataSlice,
  getBytes,
  hexlify,
  keccak256,
  zeroPadValue,
} from 'ethers';
import cloneDeep from 'lodash.clonedeep';
import { DefaultGasOverheads, DefaultsForUserOp } from 'src/configs/constance';
import { AccountFactoryAbi__factory } from 'src/contracts/typechain';
import { toBeHexlify } from 'src/services';
import {
  GasOverheads,
  PackedUserOperation,
  RawUserOperation,
  UserOpMethodId,
  UserOpRequestType,
  UserOperation,
} from './type';

export function buildRequest(method: UserOpMethodId, params: Array<any>): UserOpRequestType {
  return { id: 'my-app', jsonrpc: 'v1', method, params };
}

export function getAccountInitCode(owner: string, salt: string, factoryAddress: string): BytesLike {
  const _interface = new Interface(AccountFactoryAbi__factory.abi);
  return concat([factoryAddress, _interface.encodeFunctionData('createAccount', [owner, salt])]);
}

export default class UserOperationService {
  static packAccountGasLimits(verificationGasLimit: BytesLike, callGasLimit: BytesLike): string {
    return concat([
      zeroPadValue(toBeHexlify(verificationGasLimit), 16),
      zeroPadValue(toBeHexlify(callGasLimit), 16),
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
      zeroPadValue(toBeHexlify(paymasterVerificationGasLimit), 16),
      zeroPadValue(toBeHexlify(postOpGasLimit), 16),
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

  static calcPreVerificationGas(userOp: UserOperation, overheads?: Partial<GasOverheads>): number {
    const ov = { ...DefaultGasOverheads, ...(overheads ?? {}) };
    const p: UserOperation = {
      ...userOp,
      signature: hexlify(Buffer.alloc(ov.sigSize, 1)),
      preVerificationGas: 21000,
    };
    const packed = getBytes(this.encodeUserOp(this.packUserOp(p), false));
    const lengthInWord = (packed.length + 31) / 32;
    const callDataCost = packed
      .map((x) => (x === 0 ? ov.zeroByte : ov.nonZeroByte))
      .reduce((sum, x) => sum + x);
    const ret = Math.round(
      callDataCost + ov.fixed / ov.bundleSize + ov.perUserOp + ov.perUserOpWord * lengthInWord
    );
    return ret;
  }

  static encodeUserOp(userOp: UserOperation | PackedUserOperation, forSignature = true): string {
    const packedUserOp = 'callGasLimit' in userOp ? this.packUserOp(userOp) : userOp;
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
  ): Promise<UserOperation> {
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

  private static fillUserOpDefaults(
    op: Omit<RawUserOperation, 'signature'>,
    defaults = DefaultsForUserOp
  ): UserOperation {
    const partial: any = { ...op };
    for (const key in partial) {
      if (partial[key] == null) delete partial[key];
    }
    const filled = { ...defaults, ...partial };
    return filled;
  }

  static callDataCost(data: string): number {
    return getBytes(data)
      .map((x) => (x === 0 ? 4 : 16))
      .reduce((sum, x) => sum + x);
  }

  static async fillUserOp(
    entryPointAddress: string,
    reader: JsonRpcProvider,
    op: Omit<RawUserOperation, 'signature'>
  ): Promise<Omit<UserOperation, 'signature'>> {
    const op1 = cloneDeep(op);
    if (op1.initCode) {
      const initAddress = dataSlice(op1.initCode, 0, 20);
      const initCallData = dataSlice(op1.initCode, 20);
      if (!op1.nonce) op1.nonce = 0;
      if (op1.verificationGasLimit == null) {
        const initEstimate = await reader.estimateGas({
          from: entryPointAddress,
          to: initAddress,
          data: initCallData,
          gasLimit: 10e6,
        });
        op1.verificationGasLimit = BigNumber(DefaultsForUserOp.verificationGasLimit.toString())
          .plus(initEstimate.toString())
          .toFixed();
      }
    }
    if (!op1.callGasLimit && op1.callData) {
      const estimatedGas = await reader.estimateGas({
        from: entryPointAddress,
        to: op1.sender,
        data: op1.callData.toString(),
      });
      op1.callGasLimit = estimatedGas.toString();
    }
    if (op1.paymaster) {
      if (op1.paymasterVerificationGasLimit == null) {
        op1.paymasterVerificationGasLimit = DefaultsForUserOp.paymasterVerificationGasLimit;
      }
      if (op1.paymasterPostOpGasLimit == null) {
        op1.paymasterPostOpGasLimit = DefaultsForUserOp.paymasterPostOpGasLimit;
      }
    }
    if (!op1.maxFeePerGas) {
      const block = await reader.getBlock('latest');
      if (block?.baseFeePerGas)
        op1.maxFeePerGas = BigNumber(block.baseFeePerGas.toString())
          .plus(
            op1.maxPriorityFeePerGas
              ? op1.maxPriorityFeePerGas.toString()
              : DefaultsForUserOp.maxPriorityFeePerGas.toString()
          )
          .toFixed();
    }
    if (!op1.maxPriorityFeePerGas) {
      op1.maxPriorityFeePerGas = DefaultsForUserOp.maxPriorityFeePerGas;
    }
    const op2 = this.fillUserOpDefaults(op1);
    // if (op2.preVerificationGas.toString() === '0') {
    // op2.preVerificationGas = this.callDataCost(this.encodeUserOp(op2, false));
    // }
    op2.preVerificationGas = this.calcPreVerificationGas(op2);
    return op2;
  }

  static userOpHexlify(op: UserOperation): UserOperation {
    return {
      sender: op.sender,
      nonce: op.nonce,
      callData: op.callData,
      signature: op.signature,
      initCode: op.initCode,
      callGasLimit: toBeHexlify(op.callGasLimit),
      verificationGasLimit: toBeHexlify(op.verificationGasLimit),
      preVerificationGas: toBeHexlify(op.preVerificationGas),
      maxFeePerGas: toBeHexlify(op.maxFeePerGas),
      maxPriorityFeePerGas: toBeHexlify(op.maxPriorityFeePerGas),
      paymaster: op.paymaster,
      paymasterVerificationGasLimit: toBeHexlify(op.paymasterVerificationGasLimit),
      paymasterPostOpGasLimit: toBeHexlify(op.paymasterPostOpGasLimit),
      paymasterData: op.paymasterData,
    };
  }

  static async fillSign(
    chainId: number,
    entryPointAddress: string,
    reader: JsonRpcProvider,
    op: Omit<RawUserOperation, 'signature'>,
    signer: Wallet | Signer
  ): Promise<UserOperation> {
    const filledOp = await this.fillUserOp(entryPointAddress, reader, op);
    const signedOp = await this.signUserOp(chainId, entryPointAddress, filledOp, signer);
    return this.userOpHexlify(signedOp);
  }

  static async fillSignAndPack(
    chainId: number,
    entryPointAddress: string,
    reader: JsonRpcProvider,
    op: Omit<RawUserOperation, 'signature'>,
    signer: Wallet | Signer
  ) {
    const signedOp = await this.fillSign(chainId, entryPointAddress, reader, op, signer);
    return this.packUserOp(signedOp);
  }
}
