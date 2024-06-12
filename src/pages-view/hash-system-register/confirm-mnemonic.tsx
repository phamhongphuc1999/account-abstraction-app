import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BaseForm from 'src/components/form/base-form';
import { useHashRegisterSelector } from 'src/context/hash-register-context';
import { randomList } from 'src/services';

function useStyle() {
  return {
    paper: {
      display: 'flex',
      alignItem: 'center',
      flexWrap: 'wrap',
      gap: 2,
      padding: '1rem 2rem',
    },
  };
}

interface ItemProps {
  word: string;
  events?: {
    onAdd?: () => void;
    onRemove?: () => void;
  };
}

function Item({ word, events }: ItemProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: '4px',
        border: `1px solid ${theme.palette.background.primary}`,
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
      onClick={events?.onAdd}
    >
      <Typography variant="subtitle1">{word}</Typography>
      {events?.onRemove && (
        <IconButton onClick={events.onRemove}>
          <CloseIcon sx={{ fontSize: '14px' }} />
        </IconButton>
      )}
    </Box>
  );
}

export default function ConfirmMnemonic() {
  const cls = useStyle();
  const { mnemonic } = useHashRegisterSelector((state) => state.data);
  const [correctMnemonic, setCorrectMnemonic] = useState<Array<string>>([]);
  const [validatedMnemonic, setValidatedMnemonic] = useState(randomList(mnemonic.split(' '), 10));

  function addMnemonic(word: string, _index: number) {
    setCorrectMnemonic((preValue) => {
      return [...preValue, word];
    });
    setValidatedMnemonic((preValue) => {
      preValue.splice(_index, 1);
      return preValue;
    });
  }

  function removeMnemonic(word: string, _index: number) {
    setCorrectMnemonic((preValue) => {
      preValue.splice(_index, 1);
      return preValue;
    });
    setValidatedMnemonic((preValue) => {
      return [...preValue, word];
    });
  }

  function onExecute() {
    if (correctMnemonic.join(' ') == mnemonic) {
      //
    }
    toast.warn('Invalid mnemonic');
  }

  return (
    <>
      <Typography variant="subtitle1">Step 4: Confirm mnemonic</Typography>
      <BaseForm events={{ onExecute }}>
        <Paper sx={[{ mt: 1 }, cls.paper]}>
          {correctMnemonic.map((word, index) => {
            return (
              <Item
                key={word}
                word={word}
                events={{ onRemove: () => removeMnemonic(word, index) }}
              />
            );
          })}
        </Paper>
        <Paper sx={[{ mt: 3 }, cls.paper]}>
          {validatedMnemonic.map((word, index) => {
            return (
              <Item key={word} word={word} events={{ onAdd: () => addMnemonic(word, index) }} />
            );
          })}
        </Paper>
      </BaseForm>
    </>
  );
}
