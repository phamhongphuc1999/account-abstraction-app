/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { isAddress } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ChainConfig } from 'src/configs/constances';
import { CHAINS } from 'src/configs/network-config';
import { useAppSelector } from 'src/redux-slices/hook';
import { mergeSx } from 'src/services';
import { useWalletAction } from 'src/wallet-connection/wallet-action';
import { MuiImage } from '../utils';

function useStyle(theme: Theme) {
  return {
    paper: {
      padding: 0,
      borderRadius: '8px',
      background: theme.palette.mode === 'dark' ? '#00244D' : '#F2F4F7',
    },
    title: {
      paddingBottom: '0.5rem',
      background: theme.palette.mode === 'dark' ? '#00244D' : '#F2F4F7',
    },
    listItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2),
      borderRadius: 10,
      width: '25%',
      [theme.breakpoints.only('xs')]: {
        width: '50%',
      },
    },
  };
}

interface Props {
  props?: ButtonProps;
}

export default function NetworkButton({ props }: Props) {
  const theme = useTheme();
  const cls = useStyle(theme);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { switchNetwork } = useWalletAction();
  const { chainId } = useAppSelector((state) => state.config);
  const { eoaAddress } = useAppSelector((state) => state.user);

  function onNetworkClick() {
    if (isAddress(eoaAddress)) setOpen(true);
    else toast.warn('Please connect to your wallet first!');
  }

  async function changeNetwork(chainId: number) {
    setOpen(false);
    setLoading(true);
    const data = await switchNetwork(chainId);
    if (data.status == 'fail') toast.error(data.error);
    setLoading(false);
  }

  return (
    <>
      <Button
        {...props}
        color="primary"
        variant="outlined"
        sx={mergeSx([
          { minWidth: '150px', '&.Mui-disabled': { color: '#7994C1', borderColor: '#7994C1' } },
          props?.sx,
        ])}
        onClick={() => onNetworkClick()}
        startIcon={loading ? <CircularProgress size="14px" /> : <></>}
        disabled={loading}
      >
        {isAddress(eoaAddress) ? CHAINS?.[chainId]?.name : 'Network'}
      </Button>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ elevation: 0, sx: cls.paper }}
      >
        <DialogTitle sx={cls.title}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5">Select Network</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, mt: 2 }}>
            {ChainConfig.map((item) => (
              <Box
                key={item.chainId}
                onClick={() => changeNetwork(item.chainId)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <MuiImage
                  src={item.image}
                  alt={item.name}
                  sx={{ height: '40px', marginBottom: '0.5rem', borderRadius: '50%' }}
                />
                <Typography noWrap color="text.disabled" variant="body3">
                  {item.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
