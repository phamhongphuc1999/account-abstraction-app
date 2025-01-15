import { Box, Popover, PopoverProps, Typography, useTheme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import NetworkButton from 'src/components/button/network-button';
import { MuiNavLink } from 'src/components/utils';
import { LayoutConfig } from 'src/configs/constance';

interface Props extends PopoverProps {
  setEl: Dispatch<SetStateAction<SVGSVGElement | null>>;
}

export default function SmallPopover({ setEl, ...props }: Props) {
  const theme = useTheme();
  const isLight = theme.palette.mode == 'light';

  return (
    <>
      {props.open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: 1200,
          }}
          onClick={(event) => {
            if (props.onClose) props.onClose(event, 'backdropClick');
          }}
        />
      )}
      <Popover
        {...props}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: { borderRadius: '24px', width: '100%', marginTop: '85px' },
          },
        }}
      >
        <Box
          sx={{
            boxShadow: '0px 4px 16px 0px #D7D8E380',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <NetworkButton />
          {LayoutConfig.map((item) => {
            const Icon = item.icon;

            return (
              <MuiNavLink
                key={item.id}
                to={item.link}
                sx={{ textDecoration: 'none' }}
                onClick={() => setEl(null)}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Icon sx={{ fontSize: '25px', color: isLight ? '#41556B' : '#FFFFFF' }} />
                  <Typography sx={{ color: isLight ? '#41556B' : '#FFFFFF' }}>
                    {item.title}
                  </Typography>
                </Box>
              </MuiNavLink>
            );
          })}
        </Box>
      </Popover>
    </>
  );
}
