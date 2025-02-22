import React, { useEffect ,useState} from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { Box, Card, Typography, Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const DrWallet = () => {

  const [walletBalance, setWalletBalance] = useState(0);
  const [doctor, setDoctor] = useState();
  const navigate = useNavigate();

useEffect(() => {
  const token = cookies.get('doctortoken');
  if(!token){
    navigate('/doctor/login');
    return;
  }

  const verifyTokenAndFetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctor/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      const doctorData = response.data.doctor;
      console.log("Doctor data from response:", doctorData);
      setDoctor(doctorData);


      const id = doctorData._id;
      const balance = await axios.get(`http://localhost:5000/api/doctor/doctor-wallet-balance/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setWalletBalance(balance.data);
    } catch (error) {
      console.log(error);
      navigate('/doctor/login');
    }
  };

  verifyTokenAndFetchData();
},[])
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
                <Typography variant="h3" color="primary">₹{walletBalance?.totalAmount || 0}</Typography>
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
                    <Typography variant="h5">₹{walletBalance?.totalAmount || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">This Month</Typography>
                    <Typography variant="h5">₹{walletBalance?.totalAmount || 0}</Typography>
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