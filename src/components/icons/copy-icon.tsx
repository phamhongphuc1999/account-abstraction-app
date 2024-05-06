import { ContentCopy, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  BoxProps,
  IconButton,
  IconButtonProps,
  SvgIconProps,
  Tooltip,
  Typography,
  TypographyProps,
} from '@mui/material';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface CopyIconProps {
  copyText?: string;
  defaultText?: string;
  successText?: string;
  iconProps?: SvgIconProps;
  props?: IconButtonProps;
}

export default function CopyIcon(params: CopyIconProps) {
  const { copyText = '', defaultText = 'copy', successText = 'copied', iconProps, props } = params;
  const [tooltip, setTooltip] = useState(defaultText);

  return (
    <CopyToClipboard
      text={copyText}
      onCopy={() => {
        setTooltip(successText);
        setTimeout(() => {
          setTooltip(defaultText);
        }, 1000);
      }}
    >
      <Tooltip title={tooltip}>
        <IconButton {...props}>
          <ContentCopy {...iconProps} fontSize="small" />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  );
}

interface Props {
  title: string;
  rootProps?: BoxProps;
  textProps?: TypographyProps;
  iconProps?: CopyIconProps;
}

export function TextCopy({ title, rootProps, textProps, iconProps }: Props) {
  return (
    <Box display="flex" alignItems="center" {...rootProps}>
      <Typography {...textProps}>{title}</Typography>
      <CopyIcon {...iconProps} />
    </Box>
  );
}

interface InfoIconProps {
  title: string;
  iconProps?: SvgIconProps;
}

export function InfoIcon({ title, iconProps }: InfoIconProps) {
  return (
    <Tooltip title={title}>
      <IconButton>
        <InfoOutlined {...iconProps} />
      </IconButton>
    </Tooltip>
  );
}
