import { Launch } from '@mui/icons-material';
import { Link, SvgIconProps, Typography } from '@mui/material';
import useExplorerUrl, { ExploreConfigProps } from 'src/hooks/use-explorer-url';
import { mergeSx } from 'src/services';

interface Props {
  hash: string | undefined;
  config?: Partial<ExploreConfigProps & { isShowText: boolean }>;
  iconProps?: SvgIconProps;
}

export default function ExploreIcon({ hash, config, iconProps }: Props) {
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
      {config?.isShowText != false && <Typography>View on Explorer</Typography>}
      <Launch
        {...iconProps}
        sx={mergeSx([{ fontSize: '16px', color: 'text.primary', ml: 0.5 }, iconProps?.sx])}
      />
    </Link>
  );
}
