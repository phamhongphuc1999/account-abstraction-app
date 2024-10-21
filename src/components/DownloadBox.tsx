/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, LinkProps } from '@mui/material';
import { useEffect, useRef } from 'react';
import { mergeSx } from 'src/services';

interface Props extends LinkProps {
  data?: any;
}

export default function DownloadBox({ data, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (data && ref.current) {
      ref.current.download = 'input.json';
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      ref.current.href = URL.createObjectURL(blob);
    }
  }, [data]);

  return (
    <Link {...props} ref={ref} sx={mergeSx(props.sx, { color: '#1C8CF3', textDecoration: 'none' })}>
      {props.children ?? 'Download'}
    </Link>
  );
}
