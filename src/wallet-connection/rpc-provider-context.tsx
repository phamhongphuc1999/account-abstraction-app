/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import JsonRpcBundler from 'src/user-operation-service/JsonRpcBundler';

export interface RpcProviderContextProps {
  rpc: string;
  reader: JsonRpcProvider | null;
  signer: JsonRpcSigner | null;
  bundler: JsonRpcBundler | null;
  setReaderAndBundler: (rpcUrls: Array<string>, _bundlerUrl: string) => Promise<void>;
  setSigner: (web3: JsonRpcSigner | null) => void;
}

const RpcProviderContext = createContext<RpcProviderContextProps>({
  rpc: '',
  reader: null,
  signer: null,
  bundler: null,
  setReaderAndBundler: async () => {},
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
  const [bundler, setBundler] = useState<JsonRpcBundler | null>(null);

  async function setReaderAndBundler(rpcUrls: Array<string>, _bundlerUrl: string) {
    setBundler(new JsonRpcBundler(_bundlerUrl));
    const result = await selectReader(rpcUrls);
    if (result) {
      setReader(result.web3);
      setRpc(result.rpc);
    }
  }

  const contextData = useMemo<RpcProviderContextProps>(() => {
    return { rpc, reader, signer, bundler, setReaderAndBundler, setSigner };
  }, [rpc, reader, signer, bundler]);

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
