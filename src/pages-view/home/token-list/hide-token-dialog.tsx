import { Typography } from '@mui/material';
import BaseDialog from 'src/components/BaseDialog';
import BaseForm from 'src/components/base-form';
import { StandardToken } from 'src/global';
import { useLocalStorageContext } from 'src/local-storage-connection/local-storage-context';
import { useAppDispatch } from 'src/redux-slices/store';
import { deleteToken } from 'src/redux-slices/token-slice';

interface Props {
  open: boolean;
  token: StandardToken;
  onClose: () => void;
}

export default function HideTokenDialog({ open, token, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { indexedStorage } = useLocalStorageContext();

  async function onHideToken() {
    if (indexedStorage) {
      dispatch(deleteToken(token));
      await indexedStorage.token.del(token.address);
      onClose();
    }
  }

  return (
    <BaseDialog open={open} onClose={onClose} title={`Hide ${token.symbol.toUpperCase()}`}>
      <BaseForm events={{ onExecute: onHideToken }} metadata={{ executeTitle: 'Hide' }}>
        <Typography>Are you sure hide this token?</Typography>
      </BaseForm>
    </BaseDialog>
  );
}
