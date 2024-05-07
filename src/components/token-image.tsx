/* eslint-disable react/prop-types */
import { Box, BoxProps, Typography, TypographyProps } from '@mui/material';
import { mergeSx } from 'src/services';
import { MuiImage } from './utils';

export interface TokenImageProps {
  image: string | [string, string];
  symbol?: string;
  size?: string;
  textProps?: TypographyProps;
  imageProps?: BoxProps;
  props?: BoxProps;
}

export function TokenImage({
  symbol,
  image,
  size = '20px',
  textProps,
  imageProps,
  props,
}: TokenImageProps) {
  return (
    <Box {...props} sx={mergeSx([{ display: 'flex', alignItems: 'center' }, props?.sx])}>
      {Array.isArray(image) ? (
        <Box
          sx={{
            position: 'absolute',
            marginRight: 0,
            bottom: 0,
            right: 0,
            width: `calc(${size} / 1.4142)`,
          }}
        >
          <MuiImage
            src={image[1]}
            sx={mergeSx([
              {
                position: 'absolute',
                marginRight: 0,
                bottom: 0,
                right: 0,
                width: `calc(${size} / 1.4142)`,
              },
              imageProps?.sx,
            ])}
          />
          <MuiImage
            src={image[0]}
            sx={mergeSx([
              {
                position: 'absolute',
                marginRight: 0,
                top: 0,
                width: `calc(${size} / 1.4142)`,
              },
              imageProps?.sx,
            ])}
          />
        </Box>
      ) : (
        <MuiImage
          src={image}
          sx={mergeSx([{ width: size, marginRight: '0.25rem' }, imageProps?.sx])}
        />
      )}
      {symbol && <Typography {...textProps}>{symbol}</Typography>}
    </Box>
  );
}
