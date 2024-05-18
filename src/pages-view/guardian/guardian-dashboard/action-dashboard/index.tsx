import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import CopyIcon from 'src/components/icons/copy-icon';
import GuardianTransactionTypeIcon, {
  GuardianTransactionExecutedType,
} from 'src/components/icons/guardian-transaction-type-icon';
import useGuardianOwnTransactions from 'src/hooks/use-guardian-own-transactions';
import { useAppSelector } from 'src/redux-slices/hook';
import { formatAddress } from 'src/services';

export default function ActionDashboard() {
  const { fetchOwnTransaction } = useGuardianOwnTransactions();
  const { ownTransactions } = useAppSelector((state) => state.guardian);

  useEffect(() => {
    fetchOwnTransaction();
  }, [fetchOwnTransaction]);

  return (
    <Box sx={{ mt: 1 }}>
      <Typography>Action Dashboard</Typography>
      <TableContainer sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Eta</TableCell>
              <TableCell>Executed Type</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(ownTransactions).map((transaction, index) => {
              return (
                <TableRow key={transaction.data}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{transaction.value}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>{formatAddress(transaction.data, 5)}</Typography>
                      <CopyIcon copyText={transaction.data} />
                    </Box>
                  </TableCell>
                  <TableCell>{transaction.eta}</TableCell>
                  <TableCell>
                    <GuardianTransactionExecutedType type={transaction.executedType} />
                  </TableCell>
                  <TableCell>
                    <GuardianTransactionTypeIcon type={transaction.type} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
