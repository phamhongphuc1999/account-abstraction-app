/* eslint-disable react/prop-types */
import { Box, BoxProps } from '@mui/material';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';
import { mergeSx } from 'src/services';

interface Props extends BoxProps {
  jsonProps: ReactJsonViewProps;
}

export default function CssReactJson({ jsonProps, ...props }: Props) {
  return (
    <Box
      {...props}
      sx={mergeSx([
        {
          span: { color: '#ffffff !important' },
          '& .string-value': { color: '#1C8CF3 !important' },
          '& .data-type-label': { color: '#1C8CF3 !important' },
          '& .node-ellipsis': { color: '#1C8CF3 !important' },
          '& .expanded-icon': { svg: { color: '#1C8CF3 !important' } },
          '& .collapsed-icon': { svg: { color: '#1C8CF3 !important' } },
          '& .copy-icon': { svg: { color: '#1C8CF3 !important' } },
        },
        props?.sx,
      ])}
    >
      <ReactJson {...jsonProps} />
    </Box>
  );
}
