import { JsonRpcProvider, JsonRpcSigner } from 'ethers';

export type StringListType<T = unknown> = { [key: string]: T };

export type ContractType = 'reader' | 'signer';
export type ConnectorType = 'metamask' | 'coinbase';
export type FStatus =
  | 'INITIAL'
  | 'SKIP'
  | 'EXECUTING'
  | 'SUCCESS'
  | 'FAIL'
  | 'UPDATING'
  | 'WAIT_CONFIRM';
export type DeployStatus = 'initial' | 'deployed' | 'notDeploy';

export type AddressesType = {
  ENTRY_POINT_ADDRESS: string;
  ACCOUNT_FACTORY_ADDRESS: string;
};
export type AddressesListType = { [chainId: number]: AddressesType };

export interface Connector {
  image: string;
  type: ConnectorType;
  name: string;
}
export type ConnectorListType = {
  [id in ConnectorType]: Connector;
};

export interface NativeToken {
  name: string;
  symbol: string;
  decimals: number;
}

export type StandardToken = {
  address: string;
  symbol: string;
  decimal: number;
};

export interface ActionToken extends StandardToken {
  image: string | [string, string];
}

export type Chain = {
  name: string;
  nativeCurrency: NativeToken;
  chainId: number;
  image: string;
  explorers: Array<string>;
  urls: Array<string>;
  bundlers: Array<string>;
};

export type ChainList = StringListType<Chain>;
export type GlobalProviderType = JsonRpcProvider | JsonRpcSigner;
