import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import GlobalStyles from './styles/GlobalStyles';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const getTitle = () => {
      const path = location.pathname.split('/')[1];
      const page = path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
      return `Sustain.ai | ${page}`;
    };

    document.title = getTitle();
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
