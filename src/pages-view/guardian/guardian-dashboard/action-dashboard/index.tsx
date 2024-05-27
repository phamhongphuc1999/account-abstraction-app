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
import useGuardianOwnTransactions from 'src/hooks/use-guardian-own-transactions';
import { useAppSelector } from 'src/redux-slices/store';
import DashboardTableRow from './dashboard-table-row';

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
              <TableCell>
                <Typography>Id</Typography>
              </TableCell>
              <TableCell>
                <Typography>Value</Typography>
              </TableCell>
              <TableCell>
                <Typography>Data</Typography>
              </TableCell>
              <TableCell>
                <Typography>Eta</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ minWidth: '120px' }}>Executed Type</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ minWidth: '140px' }}>Type</Typography>
              </TableCell>
              <TableCell>
                <Typography>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(ownTransactions).map((transaction, index) => {
              return (
                <DashboardTableRow key={transaction.data} transaction={transaction} index={index} />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
