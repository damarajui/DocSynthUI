import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GuideGenerator from './components/GuideGenerator';
import LandingPage from './components/LandingPage';
import { CloudUpload, Delete, ArrowForward } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GuideProvider } from './context/GuideContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#8352FD',
      },
      secondary: {
        main: '#FF6B6B',
      },
      background: {
        default: darkMode ? '#121212' : '#F4F6F8',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GuideProvider>
        <Router>
          <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/generate" element={<GuideGenerator />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Router>
      </GuideProvider>
    </ThemeProvider>
  );
}

export default App;