/* eslint-disable @typescript-eslint/no-explicit-any */
import { SxProps, Theme } from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import BigNumber from 'bignumber.js';
import { BytesLike, Interface, JsonRpcProvider, concat, hexlify, toBeHex } from 'ethers';
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
