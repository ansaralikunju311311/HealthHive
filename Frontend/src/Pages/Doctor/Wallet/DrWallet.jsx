import React, { useEffect ,useState} from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { Box, Card, Typography, Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const DrWallet = () => {

  const [walletBalance, setWalletBalance] = useState(0);
  const [doctor, setDoctor] = useState();
  const [history, setHistory] = useState();
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
      setWalletBalance(balance.data.walletBalance);
      setHistory(balance.data.history);
      // const history = await axios.get(`http://localhost:5000/api/doctor/EarningsHistory/${id}`,{
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   },
      //   withCredentials: true
      // })
      // setHistory(history.data);
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
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          bgcolor: '#f8fafc',
          minHeight: '100vh',
          marginLeft: '256px' // Add this line (64 * 4 = 256px, matching sidebar width)
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1e40af 30%, #3b82f6 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Financial Overview
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 500,
                    letterSpacing: 0.5
                  }}
                >
                  Total Balance
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mt: 2,
                    mb: 1,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  ₹{walletBalance?.totalAmount || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.8,
                    letterSpacing: 0.5
                  }}
                >
                  Available for withdrawal
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Transaction History
                  </Typography>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="transaction history">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', py: 3 }}>Patient Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', py: 3 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', py: 3 }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(history) && history.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction?.userName || 'N/A'}</TableCell>
                          <TableCell>
                            {transaction?.date ? 
                              new Date(transaction.date).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : 'N/A'}
                          </TableCell>
                          <TableCell>₹{transaction?.amount || 0}</TableCell>
                        </TableRow>
                      ))}
                      {(!Array.isArray(history) || history.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
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