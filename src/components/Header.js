import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { Brightness4, Brightness7, MenuBook, Create, Dashboard as DashboardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <AppBar position="static" elevation={0} sx={{ 
      bgcolor: 'background.paper',
      borderBottom: '2px solid',
      borderImage: 'linear-gradient(to right, #8352FD, #3742FA, #5352ED) 1',
    }}>
      <Toolbar>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" component={Link} to="/" sx={{ 
            flexGrow: 1, 
            color: 'text.primary', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            fontFamily: '"Playfair Display", serif',
            '&:hover': {
              textShadow: '0 0 8px rgba(131, 82, 253, 0.6)',
            }
          }}>
            <MenuBook sx={{ mr: 1, fontSize: 28 }} />
            DocSynth
          </Typography>
        </motion.div>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button component={Link} to="/generate" sx={{ 
              mx: 1,
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(131, 82, 253, 0.1)',
              }
            }}>
              <Create sx={{ mr: 1 }} />
              Generate Guide
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button component={Link} to="/dashboard" sx={{ 
              mx: 1,
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(131, 82, 253, 0.1)',
              }
            }}>
              <DashboardIcon sx={{ mr: 1 }} />
              Dashboard
            </Button>
          </motion.div>
          <IconButton 
            onClick={() => setDarkMode(!darkMode)} 
            color="inherit" 
            sx={{ 
              ml: 2,
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              }
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;