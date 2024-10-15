/* eslint-disable react/prop-types */
import { Box, BoxProps, List, ListItem, Theme, Typography, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
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

const config: Array<{ name: string; path: string; exact: boolean }> = [
  { name: 'Home', path: '/', exact: true },
  { name: 'Recovery Manager', path: '/guardian/manager', exact: true },
  { name: 'Guardian Account', path: '/guardian/account', exact: true },
  { name: 'Curve', path: '/curve-page', exact: false },
];

export default function SidebarLayout(props: BoxProps) {
  const theme = useTheme();
  const cls = useStyle(theme);
  const location = useLocation();

  return (
    <Box {...props} sx={mergeSx(cls.box, props?.sx)}>
      <List sx={{ padding: 0, width: '100%' }}>
        {config.map((item) => {
          const isMatch = item.exact
            ? item.path == location.pathname
            : location.pathname.includes(item.path);
          return (
            <ListItem key={item.path}>
              <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to={item.path}>
                <Typography sx={{ textDecoration: isMatch ? 'underline' : 'initial' }}>
                  {item.name}
                </Typography>
              </MuiNavLink>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
