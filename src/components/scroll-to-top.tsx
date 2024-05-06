import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

export default function ScrollToTop() {
  const scrollRef = useRef<HTMLDivElement>();

  const listenToScroll = () => {
    if (scrollRef?.current) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      if (winScroll > 10) {
        scrollRef.current.style.transform = 'translateY(0)';
        scrollRef.current.style.margin = '0rem 1.25rem 2.5rem 0rem';
      } else {
        scrollRef.current.style.transform = 'translateY(100%)';
        scrollRef.current.style.margin = '0rem 1.25rem 0rem 0rem';
      }
    }
  };

  useEffect(() => {
    if (scrollRef?.current) window.addEventListener('scroll', listenToScroll);
    return function cleanup() {
      window.removeEventListener('scroll', listenToScroll);
    };
  }, [scrollRef]);

  function onIconClick() {
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  return (
    <Box
      ref={scrollRef}
      sx={{
        cursor: 'pointer',
        position: 'fixed',
        transitionDuration: '0.5s',
        transform: 'translateY(100%)',
        right: 0,
        bottom: 0,
        margin: '0rem 1.25rem 0rem 0rem',
      }}
    >
      <ArrowUpwardIcon
        onClick={onIconClick}
        sx={(theme) => ({
          fontSize: '30px',
          backgroundColor: 'primary.main',
          color: '#FFFFFF',
          borderRadius: '20%',
          [theme.breakpoints.down('sm')]: {
            marginBottom: '2rem',
          },
        })}
      />
    </Box>
  );
}
