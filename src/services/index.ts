import { SxProps, Theme } from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import { BytesLike, Interface, concat } from 'ethers';
import { AccountFactoryAbi__factory } from 'src/contracts/typechain';

export function formatAddress(address: string, fractionDigits = 3) {
  return address.slice(0, fractionDigits) + '...' + address.slice(-fractionDigits);
}

export function getAccountInitCode(
  accountFactoryAddress: string,
  owner: string,
  salt = 0
): BytesLike {
  const _interface = new Interface(AccountFactoryAbi__factory.abi);
  return concat([
    accountFactoryAddress,
    _interface.encodeFunctionData('createAccount', [owner, salt]),
  ]);
}

export function capitalizeFirstLetter(text: string, mode: 'normal' | 'retain' = 'normal') {
  if (mode == 'normal') return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
  else return text.charAt(0).toUpperCase() + text.slice(1);
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
