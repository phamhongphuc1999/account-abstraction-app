/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

export interface RpcProviderContextProps {
  rpc: string;
  reader: JsonRpcProvider | null;
  signer: JsonRpcSigner | null;
  setReader: (rpcUrls: Array<string>) => Promise<void>;
  setSigner: (web3: JsonRpcSigner | null) => void;
}

const RpcProviderContext = createContext<RpcProviderContextProps>({
  rpc: '',
  reader: null,
  signer: null,
  setReader: async () => {},
  setSigner: () => {},
});

export async function selectReader(rpcUrls: Array<string>) {
  const promises = rpcUrls.map(async (rpc) => {
    const web3 = new JsonRpcProvider(rpc);
    await web3.getBlockNumber();
    return { web3, rpc };
  });
  const { web3, rpc } = await Promise.any(promises);
  return { web3, rpc };
}

interface Props {
  children: ReactNode;
}

export default function RpcProviderProvider({ children }: Props) {
  const [rpc, setRpc] = useState<string>('');
  const [reader, setReader] = useState<JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  async function _setReader(rpcUrls: Array<string>) {
    const result = await selectReader(rpcUrls);
    if (result) {
      setReader(result.web3);
      setRpc(result.rpc);
    }
  }

  const contextData = useMemo<RpcProviderContextProps>(() => {
    return { rpc, reader, signer, setReader: _setReader, setSigner };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpc, reader, signer]);

  return <RpcProviderContext.Provider value={contextData}>{children}</RpcProviderContext.Provider>;
}

export function usRpcProviderContext() {
  return useContext(RpcProviderContext);
}

export function useExecutionSelector<T = any>(selectorFn: (data: RpcProviderContextProps) => T) {
  const data = usRpcProviderContext();
  return useMemo(() => {
    return selectorFn(data);
  }, [data, selectorFn]);
}
