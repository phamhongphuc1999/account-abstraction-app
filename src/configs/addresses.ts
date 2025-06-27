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
  ACCOUNT_FACTORY_ADDRESS: '0x3fcc8e879F72CdC9e42B894CB94A77D179fE7BBC',
};

const HardhatLocalAddresses: AddressesType = {
  MULTI_CALL_ADDRESS: '',
  ENTRY_POINT_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  ACCOUNT_FACTORY_ADDRESS: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
};

export const AddressesConfig: AddressesListType = {
  [CHAIN_ALIASES.BSC_MAINNET]: BscMainnetAddresses,
  [CHAIN_ALIASES.BSC_TESTNET]: BscTestnetAddresses,
  [CHAIN_ALIASES.HARDHAT_LOCAL]: HardhatLocalAddresses,
};
