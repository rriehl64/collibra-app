import { AlertColor } from '@mui/material';
import { ReactNode } from 'react';

/**
 * SnackbarContext type definitions
 */
export interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

export interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps>;
export const useSnackbar: () => SnackbarContextType;
export default SnackbarProvider;
