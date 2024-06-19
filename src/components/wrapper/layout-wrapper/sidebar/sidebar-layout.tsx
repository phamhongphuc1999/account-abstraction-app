/* eslint-disable react/prop-types */
import { Box, BoxProps, List, ListItem, Theme, useTheme } from '@mui/material';
import { MuiNavLink } from 'src/components/utils';
import { mergeSx } from 'src/services';

function useStyle(theme: Theme) {
  return {
    box: {
      width: '130px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingY: '2rem',
    },
    subBaseLink: {
      width: '100%',
      textDecoration: 'none',
      borderRadius: '3px',
      padding: '0.75rem 0rem 0.75rem 0.75rem',
      color: theme.palette.text.secondary,
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: theme.palette.mode == 'dark' ? 'rgba(10, 61, 118, 0.25)' : '#F2F2F2',
      },
    },
    activeLink: {
      backgroundColor: theme.palette.mode == 'dark' ? '#0A3D76' : '#C9E8FF',
      color: theme.palette.primary.dark,
      '&:hover': {
        backgroundColor: theme.palette.mode == 'dark' ? '#0A3D76' : '#C9E8FF',
      },
    },
  };
}

interface Props {
  props?: BoxProps;
}

export default function SidebarLayout({ props }: Props) {
  const theme = useTheme();
  const cls = useStyle(theme);

  return (
    <Box {...props} sx={mergeSx([cls.box, props?.sx])}>
      <List sx={{ padding: 0, width: '100%' }}>
        <ListItem>
          <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/">
            Home
          </MuiNavLink>
        </ListItem>
        <ListItem>
          <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/guardian/manager">
            Recovery Manager
          </MuiNavLink>
        </ListItem>
        <ListItem>
          <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/guardian/account">
            Guardian Account
          </MuiNavLink>
        </ListItem>
        <ListItem>
          <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/curve-page">
            Curve
          </MuiNavLink>
        </ListItem>
      </List>
    </Box>
  );
}
