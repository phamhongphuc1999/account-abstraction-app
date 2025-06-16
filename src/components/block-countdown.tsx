import { Typography, TypographyProps } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getEta } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props extends TypographyProps {
  endBlock: number;
  events?: {
    onComplete?: () => void;
  };
}

export default function BlockCountdown({ endBlock, events, ...props }: Props) {
  const [blockTimestamp, setBlockTimestamp] = useState(0);
  const { reader } = usRpcProviderContext();
  const interval = useRef<NodeJS.Timeout>();

  const _fetch = useCallback(async () => {
    if (reader) {
      const currentBlock = await getEta(reader);
      if (currentBlock) {
        setBlockTimestamp(currentBlock);
        if (endBlock <= currentBlock && events?.onComplete) {
          events.onComplete();
          clearInterval(interval.current);
        }
      }
    }
  }, [reader, endBlock, events]);

  useEffect(() => {
    _fetch();
    interval.current = setInterval(() => {
      _fetch();
    }, 10000);
    return () => clearInterval(interval.current);
  }, [_fetch]);

  return <Typography {...props}>{endBlock - blockTimestamp}</Typography>;
}
