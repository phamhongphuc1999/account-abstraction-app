import { Launch } from '@mui/icons-material';
import { Link, SvgIconProps, Typography } from '@mui/material';
import { ExploreConfigProps, useExplorerUrl } from '@peter-present/react-hook-utils';
import { useAppSelector } from 'src/redux-slices/store';
import { mergeSx } from 'src/services';

interface Props {
  hash: string | undefined;
  config?: Partial<ExploreConfigProps & { isShowText: boolean }>;
  iconProps?: SvgIconProps;
}

export default function ExploreIcon({ hash, config, iconProps }: Props) {
  const { chainId: appChainId } = useAppSelector((state) => state.config);
  const realChainId = appChainId > 0 ? appChainId : config?.chainId ? config.chainId : 56;
  const { link } = useExplorerUrl(hash, { ...config, chainId: realChainId });

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
      {config?.isShowText != false && (
        <Typography sx={{ fontSize: '14px' }}>View on Explorer</Typography>
      )}
      <Launch
        {...iconProps}
        sx={mergeSx([{ fontSize: '14px', color: 'primary.main', ml: 0.5 }, iconProps?.sx])}
      />
    </Link>
  );
}
