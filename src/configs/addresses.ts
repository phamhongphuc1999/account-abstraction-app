import { AddressesListType, AddressesType } from 'src/global';
import { CHAIN_ALIASES } from './network-config';

const BscMainnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '',
  ACCOUNT_FACTORY_ADDRESS: '',
};

const BscTestnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '0x3c123A703F1773C3cf5BdD6D000fd3Db466Cb4B9',
  ACCOUNT_FACTORY_ADDRESS: '0x4CfB5895322ebDBD328cc63C51177cb720100428',
};

export const AddressesConfig: AddressesListType = {
  [CHAIN_ALIASES.BSC_MAINNET]: BscMainnetAddresses,
  [CHAIN_ALIASES.BSC_TESTNET]: BscTestnetAddresses,
};
