import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2B4B80',
      light: '#3D5A8C',
      dark: '#1A3A6E',
    },
    secondary: {
      main: '#505A5B',
      light: '#636D6E',
      dark: '#3D4748',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    success: {
      main: '#2B4B80',
      light: '#3D5A8C',
      dark: '#1A3A6E',
    },
    info: {
      main: '#4A6FA5',
    },
    warning: {
      main: '#C47F17',
    },
    error: {
      main: '#B54141',
    },
  },
});

export default theme;
