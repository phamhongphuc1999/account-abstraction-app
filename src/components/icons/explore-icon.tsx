import { Launch } from '@mui/icons-material';
import { Link, Typography } from '@mui/material';
import useExplorerUrl, { ExploreConfigProps } from 'src/hooks/use-explorer-url';

interface Props {
  hash: string | undefined;
  config: ExploreConfigProps;
}

export default function ExploreIcon({ hash, config }: Props) {
  const { link } = useExplorerUrl(hash, config);

  return (
    <Link
      href={link}
      target="_blank"
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'primary.main',
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      <Typography>View on Explorer</Typography>
      <Launch sx={{ fontSize: '16px', color: 'primary.main', ml: 0.5 }} />
    </Link>
  );
}
