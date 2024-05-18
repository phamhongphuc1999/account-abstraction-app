import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Box, Popover, PopoverProps, Theme, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import { SearchTextField } from 'src/components/text-field/search-text-field';

function useStyle(theme: Theme) {
  return {
    popover: {
      background: theme.palette.mode == 'dark' ? '#00172D' : '#EFF2F8',
      padding: '1rem',
      borderRadius: '8px',
      border: theme.palette.mode == 'dark' ? '1px solid #132741' : '1px solid #E5E5E5',
      width: '330px',
    },
    popoverItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 0.5rem',
      marginTop: '0.5rem',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:hover': {
        background:
          theme.palette.mode == 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      },
    },
  };
}

export interface BasePopoverProps<T = unknown> {
  items: Array<T>;
  fn: {
    keyFn?: (item: T) => string;
    renderItemFn: (item: T) => ReactNode;
    filterItemsFn?: (item: T, searchText: string) => boolean;
  };
  events?: {
    onSelectItem?: (item: T) => void;
  };
  metadataProps?: {
    showSearch?: boolean;
  };
  props: PopoverProps;
}

export default function BaseSelectorPopover<T = unknown>(params: BasePopoverProps<T>) {
  const { items, fn, events, metadataProps, props } = params;
  const theme = useTheme();
  const cls = useStyle(theme);
  const [searchText, setSearchText] = useState('');

  const showSearch =
    metadataProps?.showSearch == undefined ? items.length > 6 : metadataProps.showSearch;

  const realItems = items.filter((item) => {
    return fn.filterItemsFn ? fn.filterItemsFn(item, searchText) : true;
  });

  function onSelectItem(item: T) {
    if (events?.onSelectItem) events.onSelectItem(item);
  }

  return (
    <Popover {...props} sx={{ '& .MuiPaper-root': cls.popover }}>
      {showSearch && (
        <SearchTextField
          props={{ fullWidth: true, onChange: (event) => setSearchText(event.target.value) }}
        />
      )}
      <Box sx={{ maxHeight: '300px', mt: '1rem', overflow: 'auto scroll' }}>
        {realItems.map((item, index) => {
          const _key = fn?.keyFn ? `index${fn.keyFn(item)}` : index;
          return (
            <Box key={_key} sx={cls.popoverItem} onClick={() => onSelectItem(item)}>
              {fn.renderItemFn(item)}
              <ArrowForwardOutlinedIcon sx={{ color: 'text.disabled', fontSize: '16px' }} />
            </Box>
          );
        })}
      </Box>
    </Popover>
  );
}
