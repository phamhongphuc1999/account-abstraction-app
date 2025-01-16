import BnbImg from 'src/assets/images/tokens/bnb.svg';
import CoinbaseImage from 'src/assets/images/wallets/coinbase.png';
import MetamaskImage from 'src/assets/images/wallets/metamask.png';
import { ChainList, ConnectorListType, NativeToken } from 'src/global';

export const BNB: NativeToken = { name: 'BNB', symbol: 'BNB', decimals: 18 };
export const ETH: NativeToken = { name: 'Ethereum', symbol: 'ETH', decimals: 18 };

export const CHAIN_ALIASES = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
  HARDHAT_LOCAL: 31337,
};

export const AllowedNetwork = [
  CHAIN_ALIASES.BSC_MAINNET,
  CHAIN_ALIASES.BSC_TESTNET,
  CHAIN_ALIASES.HARDHAT_LOCAL,
];

export const CHAINS: ChainList = {
  [CHAIN_ALIASES.BSC_MAINNET]: {
    image: BnbImg,
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
    bundlers: ['http://localhost:3025'],
  },
  [CHAIN_ALIASES.BSC_TESTNET]: {
    image: BnbImg,
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
    bundlers: ['http://localhost:3025'],
  },
  [CHAIN_ALIASES.HARDHAT_LOCAL]: {
    image: BnbImg,
    chainId: CHAIN_ALIASES.HARDHAT_LOCAL,
    explorers: ['https://testnet.bscscan.com'],
    name: 'Hardhat network',
    nativeCurrency: ETH,
    urls: ['http://127.0.0.1:8545/'],
    bundlers: ['http://localhost:3025'],
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
