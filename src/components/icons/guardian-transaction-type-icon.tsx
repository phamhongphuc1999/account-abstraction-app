/* eslint-disable react/prop-types */
import {
  AddCircleOutlineOutlined,
  AdjustOutlined,
  BackspaceOutlined,
  ErrorOutlineOutlined,
  LayersOutlined,
  RemoveCircleOutlineOutlined,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { Box, SvgIconProps, Typography } from '@mui/material';
import { useMemo } from 'react';
import { OwnerExecutedType, OwnerTransactionType } from 'src/configs/constance';
import { mergeSx } from 'src/services';

interface Props {
  type: number;
  props?: SvgIconProps;
}

export default function GuardianTransactionTypeIcon({ type, props }: Props) {
  const { Icon, text } = useMemo(() => {
    if (type == OwnerTransactionType.SetThreshold)
      return { Icon: AdjustOutlined, text: 'Set Threshold' };
    else if (type == OwnerTransactionType.AddGuardian)
      return { Icon: AddCircleOutlineOutlined, text: 'Add Guardian' };
    else return { Icon: RemoveCircleOutlineOutlined, text: 'Remove Guardian' };
  }, [type]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Icon {...props} sx={mergeSx([{ mr: 1 }, props?.sx])} />
      <Typography>{text}</Typography>
    </Box>
  );
}

export function GuardianTransactionExecutedType({ type, props }: Props) {
  const { Icon, text } = useMemo(() => {
    if (type == OwnerExecutedType.Queue) return { Icon: LayersOutlined, text: 'Queue' };
    else if (type == OwnerExecutedType.Success)
      return { Icon: ThumbUpAltOutlined, text: 'Success' };
    else if (type == OwnerExecutedType.Fail) return { Icon: ErrorOutlineOutlined, text: 'Error' };
    else return { Icon: BackspaceOutlined, text: 'Cancel' };
  }, [type]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Icon {...props} sx={mergeSx([{ mr: 1 }, props?.sx])} />
      <Typography>{text}</Typography>
    </Box>
  );
}
