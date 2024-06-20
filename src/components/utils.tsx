import { Box, BoxProps, styled, useTheme } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { mergeSx } from 'src/services';

export const MuiImage = styled('img')(() => ({}));
export const MuiLink = styled(Link)(() => ({}));
export const MuiNavLink = styled(NavLink)(() => ({}));

interface CssDivideProps {
  props?: BoxProps;
}
export function CssDivide({ props }: CssDivideProps) {
  const theme = useTheme();

  return (
    <Box
      {...props}
      sx={mergeSx([{ width: '100%', height: '2px', background: theme.palette.background.primary }])}
    />
  );
}
