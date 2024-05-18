/* eslint-disable react/prop-types */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SvgIconProps } from '@mui/material';
import { mergeSx } from 'src/services';
import { SvgComponent } from '.';

export interface ArrowAnimationIconProps {
  isTransform: boolean;
  icon?: SvgComponent;
  props?: SvgIconProps;
}

export function ArrowAnimationIcon({ isTransform, icon, props }: ArrowAnimationIconProps) {
  const Icon = icon ?? ExpandMoreIcon;

  return (
    <Icon
      {...props}
      sx={mergeSx([
        isTransform
          ? { transform: 'rotate(180deg)', transition: '0.5s' }
          : { transform: 'rotate(0deg)', transition: '0.5s' },
        props?.sx,
      ])}
    />
  );
}
