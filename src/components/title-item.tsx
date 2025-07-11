import {
  Box,
  BoxProps,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode } from 'react';
import { capitalizeFirstLetter, mergeSx } from 'src/services';
import PasswordTextField from './text-field/password-text-field';

interface Props extends Omit<BoxProps, 'component'> {
  title?: string;
  titleWidth?: string;
  component: ReactNode;
}

export default function TitleItem({ title, titleWidth = '55px', component, ...props }: Props) {
  const theme = useTheme();

  return (
    <Box
      {...props}
      sx={mergeSx(
        { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        props?.sx
      )}
    >
      {title && (
        <Box sx={{ width: titleWidth }}>
          <Typography sx={{ color: theme.palette.mode == 'dark' ? '#7994C1' : '#41556B' }}>
            {capitalizeFirstLetter(title)}
          </Typography>
        </Box>
      )}
      <Box sx={{ width: title ? `calc(100% - ${titleWidth})` : '100%' }}>{component}</Box>
    </Box>
  );
}

interface TextProps extends Omit<Props, 'component'> {
  isPassword?: boolean;
  textFieldProps?: TextFieldProps;
}

export function TitleTextFieldItem(params: TextProps) {
  const { title, titleWidth = '55px', isPassword, textFieldProps, ...props } = params;
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TitleItem
      title={smDown ? undefined : title}
      titleWidth={titleWidth}
      component={
        isPassword ? (
          <PasswordTextField {...textFieldProps} />
        ) : (
          <TextField {...textFieldProps} label={title} />
        )
      }
      {...props}
    />
  );
}
