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
// import { getDoctorPayment } from '../../Services/doctorService/doctorService';
import { getDoctorPayment } from '../../Services/adminService/adminService';
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
        const response = await getDoctorPayment(currentPage, limit);
        console.log("this is the response", response);
        setPayments(response?.doctorWiseTotals);
        setTotalAmount(response?.totalAmount);
        setTotalPages(response?.totalPages || 1);

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="lg:w-64 lg:fixed lg:inset-y-0">
        <Sidebar />
      </div>
      <div className="lg:ml-64 w-full p-4 lg:p-8">
        <Container maxWidth="xl" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ 
            mb: 4, 
            color: '#2c3e50', 
            fontWeight: 500,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            Doctor Payments
          </Typography>

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

          <Card sx={{ 
            mb: 4,
            overflowX: 'auto'
          }}>
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
      </div>
    </div>
  );
};

export default DoctorPayment;