import { ZeroAddress } from 'ethers';
import BSC from 'src/assets/images/tokens/bnb.svg';
import { toBeHexlify } from 'src/services';
import { GasOverheads, UserOperation } from 'src/user-operation-service/type';

export const ChainConfig = [
  { chainId: 56, image: BSC, name: 'BSC Mainnet' },
  { chainId: 97, image: BSC, name: 'BSC Testnet' },
];

export const SIMPLE_SALT = '0x'.padEnd(66, '0');

export const DefaultsForUserOp: UserOperation = {
  sender: ZeroAddress,
  nonce: 0,
  initCode: '0x',
  callData: '0x',
  callGasLimit: toBeHexlify('0'),
  verificationGasLimit: toBeHexlify('150000'), // default verification gas. will add create2 cost (3200+200*length) if initCode exists
  preVerificationGas: toBeHexlify('21000'), // should also cover calldata cost.
  maxFeePerGas: toBeHexlify('0'),
  maxPriorityFeePerGas: toBeHexlify('1000000000'),
  paymaster: ZeroAddress,
  paymasterData: '0x',
  paymasterVerificationGasLimit: toBeHexlify('300000'),
  paymasterPostOpGasLimit: toBeHexlify('0'),
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
