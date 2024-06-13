import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { WalletKeyType } from 'src/global';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { changeWalletType } from 'src/redux-slices/config-slice';
import { useAppDispatch } from 'src/redux-slices/store';

interface Props {
  setMode: (mode: WalletKeyType) => void;
}

export default function LoginForm({ setMode }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { indexedStorage } = useLocalStorageContext();

  function loginByMetamask() {
    dispatch(changeWalletType({ walletType: 'metamask' }));
    navigate('/wagmi-wallet');
  }

  async function loginByHashSystemWallet() {
    if (indexedStorage) {
      const _metadata = await indexedStorage.hashWalletMetadata.getAll();
      if (_metadata.length > 0) setMode('hash-system');
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Button variant="contained" onClick={loginByMetamask}>
          Login by Metamask
        </Button>
        <Button variant="outlined" onClick={loginByHashSystemWallet}>
          Login by Hash system Wallet
        </Button>
      </Box>
      <Typography>OR</Typography>
      <Button variant="contained" sx={{ mt: 1 }} onClick={() => navigate('/hash-system-register')}>
        Register Hash system Wallet
      </Button>
    </>
  );
}
