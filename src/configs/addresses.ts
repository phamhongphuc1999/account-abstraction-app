import { AddressesListType, AddressesType } from 'src/global';
import { CHAIN_ALIASES } from './network-config';

const BscMainnetAddresses: AddressesType = {
  ENTRY_POINT_ADDRESS: '',
  ACCOUNT_FACTORY_ADDRESS: '',
  MULTI_CALL_ADDRESS: '0x956BBC80253755A48FBcCC6783BBB418C793A257',
};

const BscTestnetAddresses: AddressesType = {
  MULTI_CALL_ADDRESS: '0xd808400FbF312ACA5C7487cd30B0D1386e04BC78',

  /* using standard entry point */
  ENTRY_POINT_ADDRESS: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  ACCOUNT_FACTORY_ADDRESS: '0x81EcF5E293fc00C6c70DFA232A1A90a07Dc149E3',
};

export const AddressesConfig: AddressesListType = {
  [CHAIN_ALIASES.BSC_MAINNET]: BscMainnetAddresses,
  [CHAIN_ALIASES.BSC_TESTNET]: BscTestnetAddresses,
};
