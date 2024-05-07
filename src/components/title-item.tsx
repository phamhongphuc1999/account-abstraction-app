/* eslint-disable react/prop-types */
import { Box, BoxProps, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { capitalizeFirstLetter, mergeSx } from 'src/services';

interface Props {
  title: string;
  titleWidth?: string;
  component: ReactNode;
  props?: BoxProps;
}

export default function TitleItem({ title, titleWidth = '55px', component, props }: Props) {
  const theme = useTheme();

  return (
    <Box
      {...props}
      sx={mergeSx([
        { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        props?.sx,
      ])}
    >
      <Box sx={{ width: titleWidth }}>
        <Typography sx={{ color: theme.palette.mode == 'dark' ? '#7994C1' : '#41556B' }}>
          {capitalizeFirstLetter(title)}
        </Typography>
      </Box>
      <Box sx={{ width: `calc(100% - ${titleWidth})` }}>{component}</Box>
    </Box>
  );
}
