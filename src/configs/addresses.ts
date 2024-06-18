import { AddressesListType, AddressesType } from 'src/global';
import { CHAIN_ALIASES } from './network-config';

const BscMainnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '',
  ACCOUNT_FACTORY_ADDRESS: '',
  MULTI_CALL_ADDRESS: '0x956BBC80253755A48FBcCC6783BBB418C793A257',
};

const BscTestnetAddresses: AddressesType = {
  MULTI_CALL_ADDRESS: '0xd808400FbF312ACA5C7487cd30B0D1386e04BC78',

  /* using my entry point */
  // ENTRY_POINT_ADDRESS: '0x8E067F19b8d29e03c7917274C40F6f0Fad46f387',
  // ACCOUNT_FACTORY_ADDRESS: '0x2678CFeDeef1Ba31240199A2c5EE53A886cc836b',

  /* using standard entry point */
  ENTRY_POINT_ADDRESS: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  ACCOUNT_FACTORY_ADDRESS: '0x08354D30Fb309F8873af9352abC247B4A734c2A5',
};

export const AddressesConfig: AddressesListType = {
  [CHAIN_ALIASES.BSC_MAINNET]: BscMainnetAddresses,
  [CHAIN_ALIASES.BSC_TESTNET]: BscTestnetAddresses,
};
