import CoinbaseImage from 'src/assets/images/wallets/coinbase.png';
import MetamaskImage from 'src/assets/images/wallets/metamask.png';
import { ChainList, ConnectorListType, NativeToken } from 'src/global';

export const BNB: NativeToken = { name: 'BNB', symbol: 'BNB', decimals: 18 };
export const ETH: NativeToken = { name: 'Ethereum', symbol: 'ETH', decimals: 18 };

export const CHAIN_ALIASES = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
};

export const AllowedNetwork = [CHAIN_ALIASES.BSC_MAINNET, CHAIN_ALIASES.BSC_TESTNET];

export const CHAINS: ChainList = {
  [CHAIN_ALIASES.BSC_MAINNET]: {
    chainId: CHAIN_ALIASES.BSC_MAINNET,
    explorers: ['https://bscscan.com'],
    name: 'BSC Mainnet',
    nativeCurrency: BNB,
    urls: [
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed2.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
      'https://bsc-dataseed2.ninicoin.io/',
      'https://bsc-dataseed.binance.org/',
    ],
  },
  [CHAIN_ALIASES.BSC_TESTNET]: {
    chainId: CHAIN_ALIASES.BSC_TESTNET,
    explorers: ['https://testnet.bscscan.com'],
    name: 'BSC Testnet',
    nativeCurrency: BNB,
    urls: [
      'https://data-seed-prebsc-2-s2.binance.org:8545/',
      'https://data-seed-prebsc-1-s3.binance.org:8545/',
      'https://data-seed-prebsc-2-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ],
  },
};

export const CONNECTORS: ConnectorListType = {
  metamask: {
    image: MetamaskImage,
    type: 'metamask',
    name: 'MetaMask',
  },
  coinbase: {
    image: CoinbaseImage,
    type: 'coinbase',
    name: 'CoinBase',
  },
};
