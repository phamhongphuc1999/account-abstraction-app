import { useMemo } from 'react';
import { useAppSelector } from 'src/redux-slices/hook';

export type EXPLORER_TYPE = 'address' | 'transaction';

const exploreConfig: {
  [chainId: number]: { address: string; transaction: string; label: string };
} = {
  56: {
    address: 'https://bscscan.com/address',
    transaction: 'https://bscscan.com/tx',
    label: 'bscscan',
  },
  97: {
    address: 'https://testnet.bscscan.com/address',
    transaction: 'https://testnet.bscscan.com/tx',
    label: 'bsctestscan',
  },
};

export interface ExploreConfigProps {
  chainId: number;
  type?: EXPLORER_TYPE;
  baseLink?: boolean;
}

export function getExplorerUrl(hash: string, config: ExploreConfigProps) {
  const { chainId, type: configType, baseLink } = config;

  const type = configType ?? 'address';
  if (exploreConfig[chainId]) {
    const _config = exploreConfig[chainId];
    if (baseLink) return { link: `${_config[type]}`, text: _config['label'] };
    return { link: `${_config[type]}/${hash}`, text: _config['label'] };
  } else return { link: undefined, text: '' };
}

export default function useExplorerUrl(
  hash: string | undefined,
  config?: Partial<ExploreConfigProps>
) {
  const chainId = config?.chainId;
  const { chainId: appChainId } = useAppSelector((state) => state.config);
  const realChainId = appChainId > 0 ? appChainId : chainId ? chainId : 56;

  return useMemo<{ link: string | undefined; text: string }>(() => {
    if (hash) return getExplorerUrl(hash, { ...config, chainId: realChainId });
    else return { link: undefined, text: '' };
  }, [hash, config, realChainId]);
}
