import { CloseOutlined, MenuOutlined } from '@mui/icons-material';
import { Box, BoxProps, Container, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import ConnectionButton from 'src/components/button/connection-button';
import NetworkButton from 'src/components/button/network-button';
import ThemeButton from 'src/components/button/theme-button';
import { MuiNavLink } from 'src/components/utils';
import { LayoutConfig } from 'src/configs/constance';
import { getColor } from 'src/services';
import SmallPopover from './SmallPopover';

interface HeaderTextProps extends BoxProps {
  title: string;
}

function HeaderText({ title, ...props }: HeaderTextProps) {
  return (
    <Box
      {...props}
      sx={{
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        cursor: 'pointer',
        color: '#363C53',
        '&:hover': {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Typography
        sx={{ fontSize: '16px', fontWeight: 500, lineHeight: '18px' }}
        color="primary.dark"
      >
        {title}
      </Typography>
    </Box>
  );
}

export default function Header() {
  const theme = useTheme();
  const isLight = theme.palette.mode == 'light';
  const [smallEl, setSmallEl] = useState<SVGSVGElement | null>(null);
  const smallOpen = Boolean(smallEl);

  function onSmallPopoverClose() {
    setSmallEl(null);
  }

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          zIndex: 1205,
          height: '65px',
          transform: 'translateX(-50%)',
          borderRadius: '999px',
          backgroundColor: getColor(theme.palette.mode, '#021C39', '#ffffff'),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Box>
            <NetworkButton className="network-button" />
            <ConnectionButton />
          </Box>
          <Box className="header-item-box">
            {LayoutConfig.map((item) => {
              return (
                <MuiNavLink key={item.id} to={item.link} sx={{ textDecoration: 'none' }}>
                  <HeaderText title={item.title} />
                </MuiNavLink>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeButton />
            {smallOpen ? (
              <CloseOutlined
                sx={{ height: '16px', width: '16px', color: isLight ? '#354455' : '#7994c1' }}
                onClick={onSmallPopoverClose}
              />
            ) : (
              <MenuOutlined
                sx={{ height: '16px', width: '16px', color: isLight ? '#354455' : '#7994c1' }}
                onClick={(event) => setSmallEl(event.currentTarget)}
              />
            )}
          </Box>
        </Box>
      </Container>
      <SmallPopover
        id="small-header-popover"
        anchorEl={smallEl}
        open={smallOpen}
        onClose={onSmallPopoverClose}
        setEl={setSmallEl}
      />
    </>
  );
}
