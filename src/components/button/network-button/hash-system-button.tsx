/* eslint-disable react/prop-types */
import { Button, ButtonProps } from '@mui/material';
import { isAddress } from 'ethers';
import { CHAINS } from 'src/configs/network-config';
import { useAppSelector } from 'src/redux-slices/store';
import { mergeSx } from 'src/services';

interface Props {
  props?: ButtonProps;
}

export default function HashSystemButton({ props }: Props) {
  const { chainId } = useAppSelector((state) => state.config);
  const { ownerAddress } = useAppSelector((state) => state.user);

  return (
    <Button
      {...props}
      color="primary"
      variant="outlined"
      sx={mergeSx([
        { minWidth: '150px', '&.Mui-disabled': { color: '#7994C1', borderColor: '#7994C1' } },
        props?.sx,
      ])}
    >
      {isAddress(ownerAddress) ? CHAINS?.[chainId]?.name : 'Network'}
    </Button>
  );
}
