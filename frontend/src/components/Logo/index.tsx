import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', animated = true }) => {
  const theme = useTheme();
  
  const dimensions = {
    small: { width: 32, height: 32, fontSize: '0.9rem' },
    medium: { width: 40, height: 40, fontSize: '1.2rem' },
    large: { width: 48, height: 48, fontSize: '1.5rem' }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': animated ? {
          '& svg': {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 0 8px rgba(43, 75, 128, 0.3))',
          },
          '& .ai': {
            color: theme.palette.primary.main,
          }
        } : {},
      }}
    >
      <svg
        width={dimensions[size].width}
        height={dimensions[size].height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: 'all 0.3s ease' }}
      >
        <path
          d="M24 4L4 14V34L24 44L44 34V14L24 4Z"
          fill={theme.palette.primary.main}
          stroke={theme.palette.primary.light}
          strokeWidth="2"
        />
        <path
          d="M24 4L44 14L24 24L4 14L24 4Z"
          fill={theme.palette.primary.light}
          stroke={theme.palette.primary.main}
          strokeWidth="1"
        />
        <path
          d="M24 12L34 16V20L24 24L14 20V16L24 12Z"
          fill="white"
          opacity="0.6"
        />
      </svg>
      <Typography
        variant="h6"
        sx={{
          fontSize: dimensions[size].fontSize,
          fontWeight: 600,
          color: theme.palette.primary.main,
          display: { xs: size === 'small' ? 'none' : 'block', sm: 'block' },
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          '& .ai': {
            color: theme.palette.primary.light,
            fontWeight: 400,
            transition: 'color 0.3s ease',
          }
        }}
      >
        Sustain<span className="ai">.ai</span>
      </Typography>
    </Box>
  );
};

export default Logo;