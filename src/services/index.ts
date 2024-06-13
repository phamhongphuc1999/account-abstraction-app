/* eslint-disable @typescript-eslint/no-explicit-any */
import { SxProps, Theme } from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import BigNumber from 'bignumber.js';
import {
  BigNumberish,
  BytesLike,
  Interface,
  JsonRpcProvider,
  concat,
  hexlify,
  toBeHex,
} from 'ethers';
import cloneDeep from 'lodash.clonedeep';
import { SIMPLE_EXTEND } from 'src/configs/constance';
import { AccountFactoryAbi__factory } from 'src/contracts/typechain';
import { ThemeMode } from 'src/global';

export function formatAddress(address: string, fractionDigits = 3) {
  return address.slice(0, fractionDigits) + '...' + address.slice(-fractionDigits);
}

export function getAccountInitCode(owner: string, salt: string, factoryAddress: string): BytesLike {
  const _interface = new Interface(AccountFactoryAbi__factory.abi);
  return concat([factoryAddress, _interface.encodeFunctionData('createAccount', [owner, salt])]);
}

export async function isDeploy(accountAddress: string, reader: JsonRpcProvider) {
  const _code = await reader.getCode(accountAddress);
  if (_code == '0x') return false;
  else return true;
}

export async function getEta(reader: JsonRpcProvider, extend = SIMPLE_EXTEND) {
  const blockNumber = await reader.getBlockNumber();
  const block = await reader.getBlock(blockNumber);
  if (block) return block.timestamp + extend;
}

export function capitalizeFirstLetter(text: string, mode: 'normal' | 'retain' = 'normal') {
  if (mode == 'normal') return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
  else return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toBeHexlify(value: string | number | Uint8Array | bigint) {
  if (typeof value == 'string' || typeof value == 'number') return hexlify(toBeHex(value));
  else if (typeof value == 'bigint') return hexlify(toBeHex(value.toString()));
  else return hexlify(value);
}

export function analyticError(rawError: any) {
  let message: undefined | string = rawError?.info?.error?.message;
  if (!message) message = String(rawError);
  return message;
}

export function getDecimalAmount(
  rawAmount: string,
  decimal: number,
  mode: 'multiple' | 'div' = 'div'
) {
  const _decimal = BigNumber('10').pow(decimal);
  if (mode == 'div') return BigNumber(rawAmount).div(_decimal);
  else return BigNumber(rawAmount).multipliedBy(_decimal);
}

export function getColor(theme: ThemeMode, darkMode: string, lightMode: string) {
  return theme == 'dark' ? darkMode : lightMode;
}

export function toHex(data: BigNumberish | BigNumber): string {
  const rawResult = data.toString(16);
  if (rawResult.slice(0, 1) != '0x') return `0x${rawResult}`;
  return rawResult;
}

export function toFixed(num: number | string, fractionDigits = 0): number {
  num = Number(num);
  if (num == 0) return Number(num.toFixed(fractionDigits));
  const fixedNum = Number(num.toFixed(fractionDigits));
  if (fixedNum == 0) return toFixed(num, fractionDigits + 1);
  return fixedNum;
}

export function randomList<T = any>(_list: Array<T>, loops: number): Array<T> {
  const _len = _list.length;
  if (_len <= 1) return cloneDeep(_list);
  const realLoops = loops > 0 ? loops : 1;
  const _result = cloneDeep(_list);
  for (let i = 0; i < realLoops; i++) {
    const _entropy = Math.floor(Math.random() * (_len - 1)) + 1;
    const temp = _result[0];
    _result[0] = _result[_entropy];
    _result[_entropy] = temp;
  }
  return _result;
}

export function mergeSx(sxs: Array<boolean | SxProps<Theme> | undefined>): SxProps<Theme> {
  let result: Array<
    boolean | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)
  > = [];
  for (const sx of sxs) {
    if (sx) {
      if (Array.isArray(sx))
        result = result.concat(
          sx as ReadonlyArray<
            boolean | SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>)
          >
        );
      else
        result.push(sx as SystemStyleObject<Theme> | ((theme: Theme) => SystemStyleObject<Theme>));
    }
  }
  return result;
}
