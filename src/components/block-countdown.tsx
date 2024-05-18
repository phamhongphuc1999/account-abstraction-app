import { Typography, TypographyProps } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { getEta } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  endBlock: number;
  events?: {
    onComplete?: () => void;
  };
  props?: TypographyProps;
}

export default function BlockCountdown({ endBlock, events, props }: Props) {
  const [blockTimestamp, setBlockTimestamp] = useState(0);
  const { reader } = usRpcProviderContext();

  const _fetch = useCallback(async () => {
    if (reader) {
      const currentBlock = await getEta(reader);
      if (currentBlock) {
        setBlockTimestamp(currentBlock);
        if (endBlock <= currentBlock && events?.onComplete) events.onComplete();
      }
    }
  }, [reader, endBlock, events]);

  useEffect(() => {
    _fetch();
    const interval = setInterval(() => {
      _fetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [_fetch]);

  return <Typography {...props}>{endBlock - blockTimestamp}</Typography>;
}
