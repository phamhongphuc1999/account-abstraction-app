import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function BaseDialog({ title, open, onClose, children }: Props) {
  const theme = useTheme();

  return (
    <Dialog
      fullWidth
      open={open}
      PaperProps={{ elevation: 0, sx: { maxWidth: 500, padding: 0, borderRadius: '8px' } }}
    >
      <DialogTitle sx={{ paddingBottom: '0.5rem', background: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography color="text.header" variant="h5">
            {title}
          </Typography>
          <IconButton onClick={() => onClose()}>
            <CloseIcon sx={{ color: 'text.header' }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
