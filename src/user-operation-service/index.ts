/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';
import {
  AbiCoder,
  JsonRpcProvider,
  Signer,
  Wallet,
  dataSlice,
  getBytes,
  hexlify,
  keccak256,
} from 'ethers';
import cloneDeep from 'lodash.clonedeep';
import { DefaultGasOverheads, DefaultsForUserOp } from 'src/configs/constance';
import { toBeHexlify } from 'src/services';
import { GasOverheads, RawUserOperation, UnSignUserOperation, UserOperation } from './type';

export default class UserOperationService {
  static packUserOp(op: UserOperation, forSignature = true): string {
    if (forSignature) {
      return AbiCoder.defaultAbiCoder().encode(
        [
          'address',
          'uint256',
          'bytes32',
          'bytes32',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'bytes32',
        ],
        [
          op.sender,
          op.nonce,
          keccak256(op.initCode),
          keccak256(op.callData),
          op.callGasLimit,
          op.verificationGasLimit,
          op.preVerificationGas,
          op.maxFeePerGas,
          op.maxPriorityFeePerGas,
          keccak256(op.paymasterAndData),
        ]
      );
    } else {
      return AbiCoder.defaultAbiCoder().encode(
        [
          'address',
          'uint256',
          'bytes',
          'bytes',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
          'bytes',
          'bytes',
        ],
        [
          op.sender,
          op.nonce,
          op.initCode,
          op.callData,
          op.callGasLimit,
          op.verificationGasLimit,
          op.preVerificationGas,
          op.maxFeePerGas,
          op.maxPriorityFeePerGas,
          op.paymasterAndData,
          op.signature,
        ]
      );
    }
  }

  static getUserOpHash(op: UserOperation, entryPoint: string, chainId: number): string {
    const userOpHash = keccak256(this.packUserOp(op, true));
    const enc = AbiCoder.defaultAbiCoder().encode(
      ['bytes32', 'address', 'uint256'],
      [userOpHash, entryPoint, chainId]
    );
    return keccak256(enc);
  }

  static calcPreVerificationGas(
    userOp: Partial<UserOperation>,
    overheads?: Partial<GasOverheads>
  ): number {
    const ov = { ...DefaultGasOverheads, ...(overheads ?? {}) };
    const p: UserOperation = {
      signature: hexlify(Buffer.alloc(ov.sigSize, 1)),
      ...userOp,
      preVerificationGas: 21000,
    } as any;
    const packed = getBytes(this.packUserOp(p, false));
    const lengthInWord = (packed.length + 31) / 32;
    const callDataCost = packed
      .map((x) => (x === 0 ? ov.zeroByte : ov.nonZeroByte))
      .reduce((sum, x) => sum + x);
    const ret = Math.round(
      callDataCost + ov.fixed / ov.bundleSize + ov.perUserOp + ov.perUserOpWord * lengthInWord
    );
    return ret;
  }

  static async sign(
    op: UnSignUserOperation,
    signer: Wallet | Signer,
    entryPoint: string,
    chainId: number
  ): Promise<UserOperation> {
    const message = getBytes(this.getUserOpHash({ ...op, signature: '' }, entryPoint, chainId));
    return { ...op, signature: await signer.signMessage(message) };
  }

  static callDataCost(data: string): number {
    return getBytes(data)
      .map((x) => (x === 0 ? 4 : 16))
      .reduce((sum, x) => sum + x);
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
      paymasterAndData: op.paymasterAndData,
    };
  }

  static fillDefaults(op: Partial<UserOperation>, defaults = DefaultsForUserOp): UserOperation {
    const partial: any = { ...op };
    for (const key in partial) {
      if (partial[key] == null) {
        delete partial[key];
      }
    }
    const filled = { ...defaults, ...partial };
    return filled;
  }

  static async fill(
    op: Omit<RawUserOperation, 'signature'>,
    reader: JsonRpcProvider,
    entryPointAddress: string
  ): Promise<UnSignUserOperation> {
    const op1 = cloneDeep(op);
    if (op.initCode) {
      const initAddr = dataSlice(op1.initCode!, 0, 20);
      const initCallData = dataSlice(op1.initCode!, 20);
      if (op1.nonce == null) op1.nonce = 0;
      if (op1.verificationGasLimit == null) {
        const initEstimate = await reader.estimateGas({
          from: entryPointAddress,
          to: initAddr,
          data: initCallData,
          gasLimit: 10e6,
        });
        op1.verificationGasLimit = BigNumber(DefaultsForUserOp.verificationGasLimit.toString())
          .plus(initEstimate.toString())
          .toFixed();
      }
    }
    if (!op1.callGasLimit && op.callData) {
      const estimatedGas = await reader.estimateGas({
        from: entryPointAddress,
        to: op1.sender,
        data: op1.callData.toString(),
      });
      op1.callGasLimit = estimatedGas; // .add(55000)
    }
    if (!op1.maxFeePerGas) {
      const block = await reader.getBlock('latest');
      if (block?.baseFeePerGas)
        op1.maxFeePerGas = BigNumber(block.baseFeePerGas.toString())
          .plus((op1.maxPriorityFeePerGas ?? DefaultsForUserOp.maxPriorityFeePerGas).toString())
          .toFixed();
    }
    if (op1.maxPriorityFeePerGas == null) {
      op1.maxPriorityFeePerGas = DefaultsForUserOp.maxPriorityFeePerGas;
    }
    const op2 = this.fillDefaults(op1);
    if (op2.preVerificationGas.toString() === '0') {
      op2.preVerificationGas = this.callDataCost(this.packUserOp(op2, false));
    }
    // op2.preVerificationGas = this.calcPreVerificationGas(op2);
    return op2;
  }

  static async fillSign(
    op: Omit<RawUserOperation, 'signature'>,
    reader: JsonRpcProvider,
    signer: Wallet | Signer,
    entryPointAddress: string,
    chainId: number
  ): Promise<UserOperation> {
    const filledOp = await this.fill(op, reader, entryPointAddress);
    const signedOp = await this.sign(filledOp, signer, entryPointAddress, chainId);
    const result = this.userOpHexlify(signedOp);
    return { ...result, preVerificationGas: toBeHexlify(this.calcPreVerificationGas(result)) };
  }
}
