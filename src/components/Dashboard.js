import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useGuideContext } from '../context/GuideContext';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { history, setHistory } = useGuideContext();

  useEffect(() => {
    axios.get('/api/history')
      .then(response => {
        setHistory(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching history:', error);
        setLoading(false);
      });
  }, [setHistory]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'projectType', headerName: 'Project Type', width: 150 },
    { field: 'status', headerName: 'Status', width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Completed' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    { field: 'createdAt', headerName: 'Created At', width: 200,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  const chartData = history.reduce((acc, item) => {
    acc[item.projectType] = (acc[item.projectType] || 0) + 1;
    return acc;
  }, {});

  const chartDataArray = Object.entries(chartData).map(([name, value]) => ({ name, value }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Paper elevation={3} sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" gutterBottom>Processing History</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <DataGrid
                    rows={history}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                )}
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Project Types</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataArray}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8352FD" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;