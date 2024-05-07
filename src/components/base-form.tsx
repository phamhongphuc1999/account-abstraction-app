import { Box, Button } from '@mui/material';
import { FormEvent, ReactNode } from 'react';

interface Props {
  events?: {
    onExecute?: () => void;
  };
  metadata?: {
    executeTitle?: string;
  };
  children?: ReactNode;
}

export default function BaseForm({ events, metadata, children }: Props) {
  const title = metadata?.executeTitle ?? 'Execute';

  function onExecute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (events?.onExecute) events.onExecute();
  }

  return (
    <form onSubmit={(event) => onExecute(event)}>
      {children}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" type="submit">
          {title}
        </Button>
      </Box>
    </form>
  );
}
