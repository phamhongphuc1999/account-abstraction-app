import { Box, BoxProps, styled, useTheme } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { mergeSx } from 'src/services';

export const MuiImage = styled('img')(() => ({}));
export const MuiLink = styled(Link)(() => ({}));
export const MuiNavLink = styled(NavLink)(() => ({}));

export function CssDivide(props: BoxProps) {
  const theme = useTheme();

  return (
    <Box
      {...props}
      sx={mergeSx(
        { width: '100%', height: '0.5px', background: theme.palette.background.primary },
        props.sx
      )}
    />
  );
}
