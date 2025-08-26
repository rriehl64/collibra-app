import React from 'react';
import { Button, ButtonProps } from '@mui/material';

// USCIS primary blue
const PRIMARY_BLUE = '#003366';
const PRIMARY_BLUE_HOVER = '#002244';

const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ sx, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={props.variant || 'contained'}
        {...props}
        sx={{
          // Standardized sizing
          px: 2.5, // horizontal padding
          py: 1.25, // vertical padding
          minHeight: 40,
          borderRadius: 2,
          fontSize: '0.95rem',
          lineHeight: 1.25,
          // Icon spacing normalization
          '& .MuiButton-startIcon': { mr: 1 },
          '& .MuiButton-endIcon': { ml: 1 },
          bgcolor: PRIMARY_BLUE,
          color: '#ffffff',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          '&:hover': {
            bgcolor: PRIMARY_BLUE_HOVER,
            boxShadow: '0 3px 10px rgba(0,0,0,0.25)'
          },
          '&:focus-visible': {
            outline: '3px solid #B31B1B',
            outlineOffset: '2px'
          },
          ...sx
        }}
      >
        {children}
      </Button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
