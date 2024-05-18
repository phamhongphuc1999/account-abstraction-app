import { Box, BoxProps, Typography } from '@mui/material';
import { formatAddress } from 'src/services';
import CopyIcon from '../icons/copy-icon';
import BaseSelector from './base-selector';
import BaseSelectorPopover, { BasePopoverProps } from './base-selector/base-selector-popover';

type HashPopoverProps = Omit<BasePopoverProps<string>, 'fn' | 'metadataProps'>;

function HashPopover(params: HashPopoverProps) {
  return (
    <BaseSelectorPopover
      {...params}
      fn={{
        keyFn: (item) => {
          return item;
        },
        renderItemFn: (item) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{formatAddress(item, 5)}</Typography>
              <CopyIcon copyText={item} />
            </Box>
          );
        },
      }}
    />
  );
}

interface Props {
  id: string;
  hash: string;
  hashes: Array<string>;
  events?: {
    onSelectItem?: (item: string) => void;
  };
  props?: BoxProps;
}

export default function HashSelect(params: Props) {
  const { id, hash, hashes, events, props } = params;

  return (
    <BaseSelector<string>
      id={id}
      item={hash}
      items={hashes}
      events={events}
      fn={{
        compareFn: (itemId, item) => {
          return itemId == item;
        },
        selectedItemFn: (selectedItem) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>{formatAddress(selectedItem, 5)}</Typography>
              <CopyIcon copyText={selectedItem} />
            </Box>
          );
        },
        popoverFn: (props) => <HashPopover {...props} />,
      }}
      metadataProps={{ defaultText: 'Remove Guardian' }}
      props={props}
    />
  );
}
