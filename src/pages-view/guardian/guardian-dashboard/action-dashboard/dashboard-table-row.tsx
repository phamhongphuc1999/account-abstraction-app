import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';
import { Interface } from 'ethers';
import { useState } from 'react';
import BlockCountdown from 'src/components/block-countdown';
import CopyIcon from 'src/components/icons/copy-icon';
import GuardianTransactionTypeIcon, {
  GuardianTransactionExecutedType,
} from 'src/components/icons/guardian-transaction-type-icon';
import { OwnerExecutedType } from 'src/configs/constance';
import { AccountAbi__factory, HashGuardianAbi__factory } from 'src/contracts/typechain';
import { GuardianOwnTransactionType } from 'src/global';
import useSendUserOp from 'src/hooks/use-send-user-op';
import { useAppSelector } from 'src/redux-slices/store';
import { formatAddress } from 'src/services';
import { usRpcProviderContext } from 'src/wallet-connection/rpc-provider-context';

interface Props {
  index: number;
  transaction: GuardianOwnTransactionType;
}

export default function DashboardTableRow({ transaction }: Props) {
  const [isComplete, setIsComplete] = useState(false);
  const { reader } = usRpcProviderContext();
  const { sendEntryPoint } = useSendUserOp();
  const { guardianAddress } = useAppSelector((state) => state.guardian);

  function onComplete() {
    setIsComplete(true);
  }

  async function onExecute() {
    if (reader) {
      const guardianInter = new Interface(HashGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('execute', [transaction.index]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    }
  }

  async function onCancel() {
    if (reader) {
      const guardianInter = new Interface(HashGuardianAbi__factory.abi);
      const accountInter = new Interface(AccountAbi__factory.abi);
      let _callData = guardianInter.encodeFunctionData('cancel', [transaction.index]);
      _callData = accountInter.encodeFunctionData('execute', [guardianAddress, 0, _callData]);
      await sendEntryPoint(_callData);
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Typography>{transaction.index}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{transaction.value}</Typography>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography>{formatAddress(transaction.data, 5)}</Typography>
          <CopyIcon copyText={transaction.data} />
        </Box>
      </TableCell>
      <TableCell>
        <Typography>
          {isComplete ? (
            <Box>
              <Typography>completed</Typography>
            </Box>
          ) : (
            <BlockCountdown endBlock={transaction.eta} events={{ onComplete }} />
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <GuardianTransactionExecutedType type={transaction.executedType} />
      </TableCell>
      <TableCell>
        <GuardianTransactionTypeIcon type={transaction.type} />
      </TableCell>
      <TableCell>
        {isComplete &&
          [OwnerExecutedType.Queue, OwnerExecutedType.Fail].includes(transaction.executedType) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="contained" onClick={onExecute}>
                Execute
              </Button>
              <Button variant="outlined" color="warning" onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          )}
      </TableCell>
    </TableRow>
  );
}
