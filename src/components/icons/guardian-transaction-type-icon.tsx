/* eslint-disable react/prop-types */
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
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
      return { Icon: AdjustOutlinedIcon, text: 'Set Threshold' };
    else if (type == OwnerTransactionType.AddGuardian)
      return { Icon: AddCircleOutlineOutlinedIcon, text: 'Add Guardians' };
    else return { Icon: RemoveCircleOutlineOutlinedIcon, text: 'Remove Guardians' };
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
    if (type == OwnerExecutedType.Queue) return { Icon: LayersOutlinedIcon, text: 'Queue' };
    else if (type == OwnerExecutedType.Success)
      return { Icon: ThumbUpAltOutlinedIcon, text: 'Success' };
    else if (type == OwnerExecutedType.Fail)
      return { Icon: ErrorOutlineOutlinedIcon, text: 'Error' };
    else return { Icon: BackspaceOutlinedIcon, text: 'Cancel' };
  }, [type]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Icon {...props} sx={mergeSx([{ mr: 1 }, props?.sx])} />
      <Typography>{text}</Typography>
    </Box>
  );
}
