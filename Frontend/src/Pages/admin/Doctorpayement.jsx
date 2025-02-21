import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
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
  Container,
  Avatar,
  Chip,
} from '@mui/material';
import { FaUserMd, FaMoneyBillWave, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';
import cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const DoctorPayment = () => {
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctorPayments = async () => {
      try {
        const token = cookies.get('admintoken');
        if (!token) {
          navigate('/admin');
          return;
        }
        console.log("this is the token", token);
        const response = await axios.get('http://localhost:5000/api/admin/getdoctorpayments', {

          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setPayments(response.data.doctorWiseTotals);
        setTotalAmount(response.data.totalAmount);
        console.log("jfnjvfnj",response.data.doctorWiseTotals);

      } catch (error) {
        console.error('Error fetching doctor payments:', error);
      }
    }
    fetchDoctorPayments();
  },[]);
  
  console.log("payments",payments);
  console.log("totalAmount",totalAmount);
  // Sample data - replace with actual data from your backend
  const [doctorPayments] = useState([
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      totalEarnings: 50000,
      pendingAmount: 15000,
      paidAmount: 35000,
      appointments: 25,
      avatar: "https://example.com/avatar1.jpg",
      recentPayments: [
        { date: '2025-02-15', amount: 5000, appointmentId: 'APT001' },
        { date: '2025-02-14', amount: 4500, appointmentId: 'APT002' },
      ]
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialization: "Neurologist",
      totalEarnings: 45000,
      pendingAmount: 10000,
      paidAmount: 35000,
      appointments: 20,
      avatar: "https://example.com/avatar2.jpg",
      recentPayments: [
        { date: '2025-02-16', amount: 6000, appointmentId: 'APT003' },
        { date: '2025-02-13', amount: 4000, appointmentId: 'APT004' },
      ]
    },
  ]);
  // Calculate total statistics
  const totalDoctorEarnings = doctorPayments.reduce((sum, doc) => sum + doc.totalEarnings, 0);
  const totalPendingAmount = doctorPayments.reduce((sum, doc) => sum + doc.pendingAmount, 0);
  const totalPaidAmount = doctorPayments.reduce((sum, doc) => sum + doc.paidAmount, 0);

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
            Doctor Payments
          </Typography>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaMoneyBillWave size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>Total Earnings</Typography>
                  </Box>
                  <Typography variant="h4">₹{totalAmount}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Total earnings across all doctors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaMoneyBillWave size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>Paid Amount</Typography>
                  </Box>
                  <Typography variant="h4">₹{}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Total amount paid to doctors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaMoneyBillWave size={24} />
                    <Typography variant="h6" sx={{ ml: 1 }}>Pending Amount</Typography>
                  </Box>
                  <Typography variant="h4">₹{totalPendingAmount.toLocaleString()}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Total pending payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Doctor Payment Details */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#2c3e50' }}>
                Doctor Payment Details
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ 
                      '& th': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                      }
                    }}>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell align="right">Total Earnings</TableCell>
                      <TableCell align="right">Paid Amount</TableCell>
                      <TableCell align="right">Pending Amount</TableCell>
                      <TableCell align="center">Appointments</TableCell>
                      {/* <TableCell align="center">AppoimentDetails</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((doctor) => (
                      <TableRow key={doctor._id} sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2 }}>
                              <FaUserMd />
                            </Avatar>
                            <Typography>{doctor.doctorName
                            }</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={doctor.specialization
                            }
                            size="small"
                            sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                            ₹{doctor.totalAmount
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                            ₹{doctor.appointmentCount
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                            ₹{doctor.appointmentCount
                            }
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<FaCalendarCheck />}
                            label={doctor.appointmentCount
                            }
                            size="small"
                            sx={{ bgcolor: '#F3E5F5', color: '#9C27B0' }}
                          />
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

export default DoctorPayment;