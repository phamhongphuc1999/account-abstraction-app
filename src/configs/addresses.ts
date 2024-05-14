import { AddressesListType, AddressesType } from 'src/global';
import { CHAIN_ALIASES } from './network-config';

const BscMainnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '',
  ACCOUNT_FACTORY_ADDRESS: '',
};

const BscTestnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  ACCOUNT_FACTORY_ADDRESS: '0x98309709176EbCC01209d38E594027b7786b1789',
};

export const AddressesConfig: AddressesListType = {
  [CHAIN_ALIASES.BSC_MAINNET]: BscMainnetAddresses,
  [CHAIN_ALIASES.BSC_TESTNET]: BscTestnetAddresses,
};
