import { Drawer, useTheme } from '@mui/material';
import SidebarLayout from './sidebar-layout';

export default function Sidebar() {
  const theme = useTheme();

  return (
    <Drawer
      anchor="left"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.mode === 'dark' ? '#0B1E33' : '#FFFFFF',
          padding: 0,
          minHeight: '650px',
          [theme.breakpoints.down('sm')]: {
            transform: 'translate(-180px)',
          },
        },
      }}
      variant="permanent"
    >
      <SidebarLayout />
    </Drawer>
  );
}
