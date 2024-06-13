import MenuIcon from '@mui/icons-material/Menu';
import { Box, Container, Drawer, useTheme } from '@mui/material';
import { useState } from 'react';
import ConnectionButton from 'src/components/button/connection-button';
import NetworkButton from 'src/components/button/network-button';
import ThemeButton from 'src/components/button/theme-button';
import { WalletKeyType } from 'src/global';
import { getColor } from 'src/services';
import SidebarLayout from '../sidebar/sidebar-layout';

interface Props {
  mode: WalletKeyType;
}

export default function Header({ mode }: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          backgroundColor: getColor(theme.palette.mode, '#021C39', '#ffffff'),
        }}
      >
        <Container
          sx={{
            height: 65,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NetworkButton
              mode={mode}
              props={{
                sx: {
                  marginRight: '0.5rem',
                  [theme.breakpoints.down('sm')]: { display: 'none' },
                },
              }}
            />
            <Box sx={{ marginRight: '0.5rem', [theme.breakpoints.up('sm')]: { display: 'none' } }}>
              <MenuIcon
                onClick={() => setIsOpen(true)}
                sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }}
              />
            </Box>
            <ConnectionButton mode={mode} />
          </Box>
          <ThemeButton />
        </Container>
      </Box>
      <Drawer
        anchor="left"
        PaperProps={{
          sx: [
            {
              backgroundColor: theme.palette.mode === 'dark' ? '#0B1E33' : '#FFFFFF',
              padding: 0,
              zIndex: 1001,
              minHeight: '650px',
              minWidth: '300px',
            },
            !isOpen && { transform: 'translate(-100%)' },
          ],
        }}
        variant="permanent"
      >
        <Box
          sx={{
            height: 65,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingX: '1rem',
          }}
        >
          <MenuIcon onClick={() => setIsOpen(false)} />
          <NetworkButton mode={mode} />
        </Box>
        <SidebarLayout props={{ sx: { width: '300px' } }} />
      </Drawer>
    </>
  );
}
