import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';

const Layout = ({ children, darkMode, setDarkMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;