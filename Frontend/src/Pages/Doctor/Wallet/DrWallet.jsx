import React from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { Box, Card, Typography, Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DrWallet = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Balance Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Wallet Balance</Typography>
                <Typography variant="h3" color="primary">₹10,000</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Withdraw</Button>
              </Card>
            </Grid>

            {/* Stats Card */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Statistics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Total Earnings</Typography>
                    <Typography variant="h5">₹50,000</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">This Month</Typography>
                    <Typography variant="h5">₹15,000</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Transactions Table */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>21 Feb 2025</TableCell>
                        <TableCell>Consultation Fee</TableCell>
                        <TableCell>₹1,000</TableCell>
                        <TableCell>Completed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>20 Feb 2025</TableCell>
                        <TableCell>Withdrawal</TableCell>
                        <TableCell>₹5,000</TableCell>
                        <TableCell>Processing</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DrWallet;