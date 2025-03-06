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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CustomPagination from '../../Components/Common/Pagination';
import DataTable from '../../Components/Common/DataTable';
import { Getdoctorpayment } from '../../Services/apiService';

const DoctorPayment = () => {
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(5); // Items per page

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctorPayments = async () => {
      try {
        // const token = cookies.get('admintoken');
        // if (!token) {
        //   navigate('/admin');
        //   return;
        // }
        // console.log("this is the token", token);
        // const response = await axios.get('http://localhost:5000/api/admin/getdoctorpayments', {
        //   params: {
        //     page: currentPage,
        //     limit: limit
        //   },

        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   },
        //   withCredentials: true,
        // });
        const response = await Getdoctorpayment(currentPage, limit);
        console.log("this is the response", response);
        setPayments(response?.doctorWiseTotals);
        setTotalAmount(response?.totalAmount);
        setTotalPages(response?.totalPages || 1);
        // console.log("jfnjvfnj",response?.doctorWiseTotals);

      } catch (error) {
        console.error('Error fetching doctor payments:', error);
      }
    }
    fetchDoctorPayments();
  },[currentPage, limit]);
  
  console.log("payments",payments);
  console.log("totalAmount",totalAmount);
 
 

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const columns = [
    {
      header: 'Doctor',
      accessor: 'doctorName',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2 }}>
            <FaUserMd />
          </Avatar>
          <Typography>{row.doctorName}</Typography>
        </Box>
      )
    },
    {
      header: 'Specialization',
      accessor: 'specialization',
      render: (row) => (
        <Chip 
          label={row.specialization}
          size="small"
          sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
        />
      )
    },
    {
      header: 'Total Earnings',
      accessor: 'totalAmount',
      render: (row) => (
        <Typography sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          ₹{row.totalAmount - (row.totalAmount * 0.1)}
        </Typography>
      )
    },
    {
      header: 'Appointments',
      accessor: 'appointmentCount',
      render: (row) => (
        <Chip
          icon={<FaCalendarCheck />}
          label={row.appointmentCount}
          size="small"
          sx={{ bgcolor: '#F3E5F5', color: '#9C27B0' }}
        />
      )
    }
  ];

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
                  <Typography variant="h4">₹{totalAmount - (totalAmount * 0.1)}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Total earnings across all doctors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#2c3e50' }}>
                Doctor Payment Details
              </Typography>
              <DataTable 
                columns={columns}
                data={payments}
                emptyMessage="No payment records found"
                headerClassName="bg-gray-50"
                rowClassName="hover:bg-gray-50 transition-colors"
              />
              <Box sx={{ mt: 3 }}>
                <CustomPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => handlePageChange(null, page)}
                />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

export default DoctorPayment;