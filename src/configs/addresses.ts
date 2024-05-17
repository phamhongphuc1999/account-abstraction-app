import { AddressesListType, AddressesType } from 'src/global';
import { CHAIN_ALIASES } from './network-config';

const BscMainnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '',
  ACCOUNT_FACTORY_ADDRESS: '',
};

const BscTestnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '0x8E067F19b8d29e03c7917274C40F6f0Fad46f387',
  // ENTRY_POINT_ADDRESS: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  // ACCOUNT_FACTORY_ADDRESS: '0x858B0A1752A7D424b096c9004Bc690213E667731',
  ACCOUNT_FACTORY_ADDRESS: '0x9E1Af6Fab9daD1581BD66148ac01cb6110eC2A25',
};

export const AddressesConfig: AddressesListType = {
  [CHAIN_ALIASES.BSC_MAINNET]: BscMainnetAddresses,
  [CHAIN_ALIASES.BSC_TESTNET]: BscTestnetAddresses,
};
