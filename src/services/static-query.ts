import { AddressesConfig } from 'src/configs/addresses';
import { AddressesType } from 'src/global';
import { useAppSelector } from 'src/redux-slices/store';

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

export function useAddressesQuery() {
  const { chainId } = useAppSelector((state) => state.config);

  return StaticQuery.getAddresses(chainId);
}
