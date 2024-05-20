import { Clear, Done } from '@mui/icons-material';
import { Box, CircularProgress, Theme, Typography, alpha, useTheme } from '@mui/material';
import ExploreIcon from 'src/components/icons/explore-icon';
import { useAppSelector } from 'src/redux-slices/hook';
import { getTxStatus } from 'src/redux-slices/tx-status-slice';
import { formatAddress } from 'src/services';

function useStyle(theme: Theme) {
  return {
    container: {
      backgroundColor: theme.palette.mode == 'dark' ? alpha('#284881', 0.8) : '#E6EAF2',
      boxShadow: '0px 0px 6px 0px rgba(121, 148, 193, 0.40) inset',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      marginBottom: 1,
    },
    content: {
      fontWeight: 400,
    },
    success: {
      color: '#25ab0d',
    },
    error: {
      color: '#f44336',
    },
  };
}

export default function TransactionStatus() {
  const theme = useTheme();
  const cls = useStyle(theme);
  const txData = useAppSelector((state) => getTxStatus(state.txStatus));

  if (!txData) return <></>;
  return (
    <Box sx={{ position: 'fixed', bottom: 30, left: 8, zIndex: 20000 }}>
      {txData.map((item) => {
        return (
          <Box key={item.id} sx={cls.container}>
            <Box position="relative">
              <Typography component="div" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                {item.title}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" py={0.5}>
              <Box display="flex" alignItems="center" mr={1}>
                {(item.status == 'WAIT_CONFIRM' || item.status === 'EXECUTING') && (
                  <CircularProgress size="16px" />
                )}
                {item.status == 'SUCCESS' && <Done sx={{ color: '#25ab0d', fontSize: '16px' }} />}
                {item.status == 'FAIL' && <Clear color="error" sx={{ fontSize: '16px' }} />}
              </Box>
              <Box>
                <Typography
                  sx={[
                    cls.content,
                    item.status == 'SUCCESS' && cls.success,
                    item.status == 'FAIL' && cls.error,
                  ]}
                >
                  {item.status == 'WAIT_CONFIRM' && 'Wait for user confirm Transaction'}
                  {item.status == 'EXECUTING' && 'Executing Transaction'}
                  {item.status == 'SUCCESS' && item.hash && (
                    <>
                      Tx Hash: {formatAddress(item.hash, 6)}{' '}
                      <ExploreIcon
                        hash={item.hash}
                        config={{ type: 'transaction' }}
                        iconProps={{ sx: { color: '#25ab0d', fontSize: '16px' } }}
                      />
                    </>
                  )}
                  {(item.status == 'FAIL' || (item.status == 'SUCCESS' && !item.hash)) &&
                    (item.error
                      ? item.error.length > 30
                        ? `${item.error.slice(0, 30)}...`
                        : item.error
                      : 'Fail')}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
