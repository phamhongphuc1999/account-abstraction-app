import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { MuiImage } from 'src/components/utils';
import { CONNECTORS } from 'src/configs/network-config';
import { ConnectorType } from 'src/global';

interface Props {
  open: boolean;
  connect?: (connector: ConnectorType, chainId?: number) => Promise<void>;
  onClose: () => void;
}

export default function ConnectionDialog({ open, connect, onClose }: Props) {
  function onConnectClick(connector: ConnectorType) {
    if (connect) connect(connector);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box sx={{ maxWidth: '400px', padding: '1rem', borderRadius: '12px' }}>
          <Box>
            <Typography sx={{ fontSize: '20px', fontWeight: 700, mb: 1.5 }}>Sign In</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            {Object.values(CONNECTORS).map((connector) => {
              return (
                <Box
                  key={connector.type}
                  onClick={() => onConnectClick(connector.type)}
                  sx={{
                    background: 'rgba(142, 184, 218, 1)',
                    borderRadius: '8px',
                    p: '1.2rem',
                    pl: 2.5,
                    mb: '1rem',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'rgba(17, 28, 24, 0.9)',
                    boxSizing: 'border-box',
                    '&:hover': {
                      backgroundColor: 'button.connect_wallet',
                      border: '1px solid #CDDCF4',
                      color: 'rgba(28, 140, 243, 1)',
                      boxShadow: '0px 3px 6px 0px #48628D1F',
                    },
                  }}
                >
                  {connector.image && (
                    <MuiImage
                      src={connector.image}
                      sx={{ width: '25px', height: '25px', mr: '0.5rem' }}
                    />
                  )}
                  <Typography variant="body3">{connector.name}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
