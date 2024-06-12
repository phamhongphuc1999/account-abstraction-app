/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/ban-types */
import { Box, BoxProps, SvgIconTypeMap, Typography, useTheme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { ReactNode } from 'react';
import { mergeSx } from 'src/services';

interface Props {
  IconComponent: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  title: string;
  children?: ReactNode;
  boxIconProps?: BoxProps;
  props?: BoxProps;
}

export default function BaseActionForm({
  IconComponent,
  title,
  children,
  boxIconProps,
  props,
}: Props) {
  const theme = useTheme();

  return (
    <Box {...props}>
      <Box
        {...boxIconProps}
        sx={mergeSx([
          {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: `1px solid ${theme.palette.background.primary}`,
            borderRadius: '8px',
            padding: 1,
            cursor: 'pointer',
          },
          boxIconProps?.sx,
        ])}
      >
        <IconComponent sx={{ fontSize: '14px' }} />
        <Typography sx={{ fontSize: '16px', cursor: 'pointer' }}>{title}</Typography>
      </Box>
      {children}
    </Box>
  );
}
