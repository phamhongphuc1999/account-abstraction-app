import { Box, BoxProps, Typography, useTheme } from '@mui/material';
import { Theme } from '@mui/system';
import { ReactNode, useEffect, useState } from 'react';
import { ArrowAnimationIcon } from 'src/components/icons/arrow-animation-icon';
import { mergeSx } from 'src/services';
import { BasePopoverProps } from './base-selector-popover';

export function useBaseSelectStyle(theme: Theme) {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      background: theme.palette.mode == 'dark' ? '#00172D' : '#EFF2F8',
      borderRadius: '8px',
      border: theme.palette.mode == 'dark' ? '1px solid #132741' : '1px solid #E5E5E5',
      padding: '0rem 1rem',
    },
    show: {
      display: 'flex',
      alignItems: 'center',
      height: '44px',
      width: '100%',
    },
  };
}

export interface BaseCssSelectProps<T = unknown> {
  id: string;
  item?: string;
  items: Array<T>;
  fn: {
    compareFn: (itemId: string | undefined, item: T) => boolean;
    selectedItemFn: (selectedITem: T) => ReactNode;
    popoverFn: (props: Omit<BasePopoverProps<T>, 'fn'>) => ReactNode;
  };
  events?: {
    onSelectItem?: (item: T) => void;
  };
  metadataProps: {
    defaultText?: string;
  };
  selectedItemProps?: BoxProps;
  props?: BoxProps;
}

export default function BaseSelector<T = unknown>(params: BaseCssSelectProps<T>) {
  const { id, item, items, fn, events, metadataProps, selectedItemProps, props } = params;
  const theme = useTheme();
  const cls = useBaseSelectStyle(theme);

  const [selectedItem, setSelectedIem] = useState<T | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? id : undefined;

  useEffect(() => {
    if (item) {
      const _item = items.find((value) => fn.compareFn(item, value));
      if (_item) setSelectedIem(_item);
      else setSelectedIem(null);
    } else setSelectedIem(null);
  }, [item, items, fn]);

  function onSelectItem(item: T) {
    setSelectedIem(item);
    if (events?.onSelectItem) events.onSelectItem(item);
    setAnchorEl(null);
  }

  return (
    <>
      <Box
        {...props}
        sx={mergeSx(cls.root, props?.sx)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Box {...selectedItemProps} sx={mergeSx(cls.show, selectedItemProps?.sx)}>
          {selectedItem ? (
            <>{fn.selectedItemFn(selectedItem)}</>
          ) : (
            <Typography color="text.disabled">{metadataProps?.defaultText ?? ''}</Typography>
          )}
        </Box>
        {items.length > 0 && (
          <ArrowAnimationIcon isTransform={open} props={{ sx: { color: '#7994C1' } }} />
        )}
      </Box>
      {items.length > 0 && (
        <>
          {fn.popoverFn({
            items,
            events: { onSelectItem },
            id: popoverId,
            open,
            anchorEl,
            onClose: () => setAnchorEl(null),
          })}
        </>
      )}
    </>
  );
}
