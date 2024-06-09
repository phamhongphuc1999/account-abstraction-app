import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { changeWalletType } from 'src/redux-slices/config-slice';
import { useAppDispatch } from 'src/redux-slices/store';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { indexedStorage } = useLocalStorageContext();

  function loginByMetamask() {
    dispatch(changeWalletType({ walletType: 'metamask' }));
    navigate('/metamask');
  }

  async function loginByHashSystemWallet() {
    if (indexedStorage) {
      const _metadata = await indexedStorage.hashWalletMetadata.getAll();
      if (_metadata.length > 0) {
        dispatch(changeWalletType({ walletType: 'hash-system' }));
        navigate('/hash-system-wallet');
      } else navigate('/hash-system-register');
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button variant="contained" onClick={loginByMetamask}>
        Login by Metamask
      </Button>
      <Button variant="outlined" onClick={loginByHashSystemWallet}>
        Login by Hash system Wallet
      </Button>
    </Box>
  );
}
