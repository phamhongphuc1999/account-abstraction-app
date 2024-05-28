import {
  alpha,
  createTheme,
  CssBaseline,
  darken,
  responsiveFontSizes,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material';
import { deepmerge } from '@mui/utils';
import { ReactNode, useMemo } from 'react';
import { useAppSelector } from 'src/redux-slices/store';
import { getColor } from 'src/services';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    default: string;
    paper: string;
    primary: string;
    secondary: string;
  }

  interface TypeText {
    primary: string;
    secondary: string;
    disabled: string;
    header: string;
    header1: string;
  }

  interface Palette {
    gradient: {
      main: string;
    };
  }

  interface PaletteOptions {
    gradient: {
      main: string;
    };
    button: {
      main: string;
      connect_wallet: string;
    };
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xsm: true;
    xxl: true;
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}

declare module '@mui/material/Hidden' {
  interface HiddenProps {
    xsmDown?: boolean;
    xsmUp?: boolean;
  }
}

const round = (value: number): number => Math.round(value * 1e5) / 1e5;
const pxToRem = (size: number): string => `${size / 16}rem`;
const buildVariant = (
  fontWeight: number,
  size: number,
  lineHeight: number,
  letterSpacing?: number
) => ({
  fontWeight,
  fontSize: pxToRem(size),
  lineHeight: `${round(lineHeight / size)}`,
  ...(letterSpacing !== undefined ? { letterSpacing: `${round(letterSpacing / size)}em` } : {}),
});

interface Props {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: Props) {
  const { themeMode } = useAppSelector((state) => state.config);

  const theme = useMemo(() => {
    return createTheme({
      breakpoints: {
        keys: ['xs', 'xsm', 'sm', 'md', 'lg', 'xl', 'xxl'],
        values: { xs: 0, xsm: 600, sm: 760, md: 960, lg: 1280, xl: 1440, xxl: 1800 },
      },
      palette: {
        mode: themeMode,
        button: {
          main: getColor(themeMode, '#192E46', '#EFF2F8'),
          connect_wallet: getColor(themeMode, '#A8D4F9', 'rgba(234, 243, 255, 1)'),
        },
        background: {
          paper: getColor(themeMode, '#00244D', '#F2F4F7'),
          secondary: '#021C39',
          primary: getColor(themeMode, '#07111C', '#021C39'),
        },
        gradient: {
          main: 'linear-gradient(180deg, #B2CEEB 0%, #e5e9ed00 100%)',
        },
        primary: {
          light: '#ffffff',
          main: '#1C8CF3',
          dark: getColor(themeMode, '#D7DFEC', '#131C23'),
        },
        secondary: {
          main: getColor(themeMode, '#001229', '#FFFFFF'),
        },
        info: {
          main: '#EAF3FF',
        },
        success: {
          main: '#49D05A',
        },
        warning: {
          main: '#F7A813',
        },
        error: {
          main: '#EA6363',
        },
        text: {
          primary: getColor(themeMode, '#FFFFFF', '#021C39'),
          secondary: getColor(themeMode, '#7994C1', '#585F5A'),
          disabled: getColor(themeMode, '#7994C1', '#021C39'),
          header: getColor(themeMode, '#CCCFD2', '#5B6B7D'),
          header1: getColor(themeMode, '#FFFFFF', '#41556B'),
        },
      },
      typography: {
        h1: buildVariant(700, 35, 41, 0.25),
        h2: buildVariant(700, 30, 35.16),
        h3: buildVariant(500, 30, 35.16),
        h4: buildVariant(700, 20, 23.44, 0.25),
        h5: buildVariant(500, 20, 23.44, 0.15),
        h6: buildVariant(400, 20, 23.44),
        body1: buildVariant(400, 16, 18.75, 0.15),
        body2: buildVariant(300, 16, 18.75, 0.15),
        body3: buildVariant(400, 14, 18.75, 0.1),
        subtitle1: buildVariant(700, 16, 18.75, 0.15),
        subtitle2: buildVariant(500, 16, 18.75, 0.15),
        button: { ...buildVariant(500, 14, 16.41, 0.15), textTransform: 'none' },
      },
    });
  }, [themeMode]);

  const baseStyle = useMemo(
    () =>
      ({
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '*': {
                '&::-webkit-scrollbar': {
                  width: '2px',
                },
                '&::-webkit-scrollbar:horizontal': {
                  height: 2,
                },
                '&::-webkit-scrollbar-thumb, &::-webkit-scrollbar-corner': {
                  backgroundColor: '#D3D3D3',
                  borderRadius: '6px',
                },
              },
              '.text-truncate': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              '.SnackbarItem-wrappedRoot .SnackbarItem-contentRoot .SnackbarItem-message': {
                ...theme.typography.body3,
              },
              'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              'input[type=number]': {
                MozAppearance: 'textfield',
              },
              '.highcharts-range-selector-group': {
                display: 'none',
              },
              '.highcharts-scrollbar': {
                display: 'none',
              },
              '.highcharts-credits': {
                display: 'none',
              },
              '.highcharts-axis-labels': {
                text: {
                  fill: `${theme.palette.text.primary} !important`,
                  color: `${theme.palette.text.primary} !important`,
                },
              },
              '.scoring-chart-tooltip-container': {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              },
              '.scoring-chart-tooltip-circle': {
                borderRadius: '50%',
                width: '10px',
                height: '10px',
                marginRight: '0.25rem',
              },
              '.scoring-chart-tooltip-x': {
                borderBottom: '1px solid silver',
                paddingBottom: '0.25rem',
              },
              '@media (max-width: 500px)': {
                '.awssld__container': {
                  paddingBottom: 'var(--slider-height-percentage) !important',
                },
              },
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                textTransform: 'capitalize',
                borderRadius: '0.5rem',
                height: '35px',
              },
              sizeMedium: {
                ...theme.typography.button,
                lineHeight: 1,
                padding: '8px 16px',
              },
              sizeLarge: {
                padding: '10px 22px',
              },
              sizeSmall: {
                padding: '4px 10px',
              },
              containedPrimary: {
                backgroundColor: theme.palette.primary.main,
                '&:hover, &.Mui-focusVisible': {
                  backgroundColor: darken(theme.palette.primary.main, 0.2),
                },
              },
              containedInfo: {
                backgroundColor: theme.palette.info.main,
                '&:hover, &.Mui-focusVisible': {
                  backgroundColor: darken(theme.palette.info.main, 0.1),
                },
              },
            },
            variants: [
              {
                props: { variant: 'gradient' },
                style: {
                  color: theme.palette.common.white,
                  background: theme.palette.gradient.main,
                  transition: 'all 250ms ease',
                  '&:hover, &.Mui-focusVisible': {
                    opacity: 0.9,
                  },
                },
              },
            ],
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                backgroundColor: theme.palette.mode == 'dark' ? '#02111F' : '#F7F7F7',
                fontWeight: 500,
                '&:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline': {
                  border: theme.palette.mode == 'dark' ? '1px solid #132741' : '1px solid #E5E5E5',
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              },
              focused: {
                '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
                  border: theme.palette.mode == 'dark' ? '1px solid #132741' : '1px solid #E5E5E5',
                },
              },
              notchedOutline: {
                border: theme.palette.mode == 'dark' ? '1px solid #132741' : '1px solid #E5E5E5',
              },
            },
          },
          MuiPopover: {
            defaultProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            },
            styleOverrides: {
              root: {
                '& .MuiPaper-root': {
                  marginTop: '0.25rem',
                },
                '& .MuiBackdrop-root': {
                  backdropFilter: 'none',
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                borderBottom: 'none',
                color: alpha(theme.palette.text.primary, 0.75),
                background: theme.palette.mode == 'light' ? '#E6EBF4' : '#092140',
                fontSize: '0.875rem',
              },
              body: {
                fontWeight: 400,
                borderBottom: 'none',
                background: theme.palette.mode == 'dark' ? '#091C34' : '#FFFFFF',
              },
            },
          },
          MuiTableSortLabel: {
            styleOverrides: {
              root: {
                '&:hover': {
                  // color: theme.palette.text.header,
                  '.MuiTableSortLabel-icon': {
                    opacity: 1,
                  },
                },
                '&.Mui-active': {
                  '.MuiTableSortLabel-icon': {
                    color: 'inherit',
                  },
                },
              },
            },
          },
          MuiRadio: {
            styleOverrides: {
              root: {
                color: '#7994C1',
              },
              checked: {
                color: '#1C8CF3',
              },
            },
          },
          MuiCheckbox: {
            styleOverrides: {
              root: {
                color: '#7994C1',
              },
              checked: {
                color: '#1C8CF3',
              },
            },
          },
          MuiContainer: {
            defaultProps: {
              maxWidth: 'lg',
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                padding: '10px 20px 10px 20px',
                background: '#EAF3FF',
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                padding: 0,
                borderRadius: '8px',
                background: theme.palette.mode == 'dark' ? '#00244D' : '#F2F4F7',
              },
            },
          },
          MuiPagination: {
            defaultProps: {
              shape: 'rounded',
              color: 'primary',
            },
          },
          MuiPaginationItem: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  boxShadow: '0px 0px 10px 1px rgba(196, 196, 196, 0.5)',
                },
                text: {
                  fontWeight: 400,
                },
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              size: 'small',
            },
            styleOverrides: {
              root: {
                '.MuiInputLabel-root': {
                  color: 'grey',
                },
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: '12px',
                color: theme.palette.text.disabled,
                backgroundColor: theme.palette.background.paper,
                borderRadius: '6px',
                padding: '0.5rem',
              },
            },
            defaultProps: {
              placement: 'top',
            },
          },
        },
      } as ThemeOptions),
    [theme]
  );

  return (
    <ThemeProvider theme={responsiveFontSizes(deepmerge(theme, baseStyle))}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
