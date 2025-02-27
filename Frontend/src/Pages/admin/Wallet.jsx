import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie'
const Wallet = () => {
  const navigate = useNavigate();
  const [adminEarning, setAdminEarnings] = useState([]);
  const [count, setCount] = useState(0);
  
   useEffect(()=>
  {
    const token = cookies.get('admintoken');
    if(!token)
    {
      navigate('/admin');
      return;
    }
    const fetchDetails =async()=>
    {
           const commition = await axios.get('http://localhost:5000/api/admin/admin-earnings',{
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
           })
           setAdminEarnings(commition.data.transaction);
           setCount(commition.data.transaction.length);
    }
    fetchDetails();
  },[])
  {adminEarning.map((er)=>
  {
    console.log("=============hhhh",er.user);
  })}
  // console.log("=============hhhh",adminEarning.user);
  console.log("=============",count);
  // Sample data - replace with actual data from your backend
  const [adminEarnings] = useState([
    {
      id: 1,
      userId: "USR001",
      userName: "John Doe",
      userPayment: 1000,
      adminCommission: 100,
      date: '2025-02-18',
      service: 'Consultation',
    },
    {
      id: 2,
      userId: "USR002",
      userName: "Jane Smith",
      userPayment: 2000,
      adminCommission: 200,
      date: '2025-02-17',
      service: 'Lab Test',
    },
  ]);




  
  const totalamount = adminEarning.reduce((sum, earning) => sum + earning.amount*0.1, 0);
  const totalTransactions = adminEarning.length;

  const averageCommission = totalamount / totalTransactions;

  console.log("=============",totalamount);
  console.log("=============fff",totalTransactions);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: '240px', flexShrink: 0 }}>
        <Sidebar />
       
      </div>
      <Box sx={{ 
        flexGrow: 1, 
        p: 2, 
        backgroundColor: '#f8f9fa', 
        height: '100vh',
        overflow: 'auto',
        width: 'calc(100% - 240px)' 
      }}>
        <Container maxWidth="xl" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 4, color: '#2c3e50', fontWeight: 500 }}>
            Admin Commission Wallet
          </Typography>

          <Card sx={{ 
            mb: 4, 
            background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)', 
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Total Commission Balance
              </Typography>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 500 }}>
                ₹{totalamount.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Based on 10% commission rate
              </Typography>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#E8F5E9',
                borderRadius: '10px',
                height: '100%'
              }}>
                <Typography color="textSecondary" variant="subtitle1" sx={{ mb: 2 }}>
                  Commission Rate
                </Typography>
                <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  10%
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#FFF3E0',
                borderRadius: '10px',
                height: '100%'
              }}>
                <Typography color="textSecondary" variant="subtitle1" sx={{ mb: 2 }}>
                  Total Transactions
                </Typography>
                <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                  {totalTransactions}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#F3E5F5',
                borderRadius: '10px',
                height: '100%'
              }}>
                <Typography color="textSecondary" variant="subtitle1" sx={{ mb: 2 }}>
                  Average Commission/Transaction
                </Typography>
                <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                  ₹{averageCommission.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Commission Earnings Table */}
          <Card sx={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#2c3e50' }}>
                Commission Earnings History
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ 
                      bgcolor: '#f5f5f5',
                      '& th': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Doctor</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>PaymentDate &Time</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>User Payment</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Admin Commission (10%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminEarning.map((earning) => (
                      <TableRow key={earning._id} sx={{ '&:hover': { bgcolor: '#f8f9fa' }, borderBottom: '1px solid #e0e0e0' }}>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {earning.userName}
                          </Typography>
                          <Typography variant="body1">
                            {earning.userName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={earning.doctorName}
                            size="small"
                            sx={{ 
                              bgcolor: '#E3F2FD',
                              color: '#1976D2',
                              '&:hover': { bgcolor: '#BBDEFB' }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {
                          // new Date
                          (earning.date).slice(4,24)
                          // .toLocaleDateString('en-IN', {
                          //   year: 'numeric',
                          //   month: 'short',
                          //   day: 'numeric'
                          // })
                          }
                        </TableCell>
                        <TableCell align="right">
                          ₹{earning.amount
                          // .
                          // toLocaleString()
                          }
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                            ₹{earning.amount * 0.1 }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </Box>
      
    </div>
  );
};

export default Wallet;