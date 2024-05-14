import { Box, Drawer, List, ListItem, Theme, useTheme } from '@mui/material';
import { MuiNavLink } from 'src/components/utils';

function useStyle(theme: Theme) {
  return {
    root: {
      backgroundColor: theme.palette.mode === 'dark' ? '#0B1E33' : '#FFFFFF',
      padding: 0,
      zIndex: 1001,
      minHeight: '650px',
    },
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

export default function Sidebar() {
  const theme = useTheme();
  const cls = useStyle(theme);

  return (
    <Drawer anchor="left" PaperProps={{ sx: cls.root }} variant="permanent">
      <Box sx={cls.box}>
        <List sx={{ padding: 0, width: '100%' }}>
          <ListItem>
            <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/">
              Home
            </MuiNavLink>
          </ListItem>
          <ListItem>
            <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/guardian">
              Guardian
            </MuiNavLink>
          </ListItem>
          <ListItem>
            <MuiNavLink sx={[cls.subBaseLink, cls.activeLink]} to="/recovery">
              Recovery
            </MuiNavLink>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
