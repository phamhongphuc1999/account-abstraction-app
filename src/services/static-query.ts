import { AddressesConfig } from 'src/configs/addresses';
import { AddressesType } from 'src/global';

const ZERO_ADDRESSES: AddressesType = {
  ENTRY_POINT_ADDRESS: '',
  ACCOUNT_FACTORY_ADDRESS: '',
  MULTI_CALL_ADDRESS: '',
};

export default class StaticQuery {
  static addresses = AddressesConfig;

  static getAddresses(chainId: number) {
    return this.addresses[chainId] ?? ZERO_ADDRESSES;
  }
}
