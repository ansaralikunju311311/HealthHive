import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie'
import DataTable from '../../Components/Common/DataTable';
import Pagination from '../../Components/Common/Pagination';
import { adminEarnings } from '../../Services/adminService/adminService';
const Wallet = () => {
  const navigate = useNavigate();
  const [adminEarning, setAdminEarnings] = useState(0);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const limit = 10;
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
   
    const fetchDetails = async () => {
      try {
       
        const commition =await adminEarnings(currentPage,limit)
        
        console.log("this is the respXXXXXonse", commition?.totalEarnings);
        setHistory(commition?.transaction);
        console.log("this is the response", commition?.transaction);
        setAdminEarnings(commition?.totalEarnings);
      

        setTotalPages(commition?.totalpage);
        setCount(commition?.count);
        console.log("this is the responselvnfjvj", commition?.count);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      }
    };
    fetchDetails();
  }, [currentPage]);

 
  
  const columns = [
    {
      header: 'User',
      accessor: 'userName',
      render: (row) => (
        <div>
          <Typography variant="body2" color="textSecondary">
            {row.userName}
  
          </Typography>
          <Typography variant="body1">
            {row.userName}
          </Typography>
        </div>
      )
    },
    {
      header: 'Doctor',
      accessor: 'doctorName',
      render: (row) => (
        <Chip
          label={row.doctorName}
          size="small"
          sx={{ 
            bgcolor: '#E3F2FD',
            color: '#1976D2',
            '&:hover': { bgcolor: '#BBDEFB' }
          }}
        />
      )
    },
    {
      header: 'Payment Date & Time',
      accessor: 'date',
      render: (row) => row.date.slice(4, 24)
    },
    {
      header: 'User Payment',
      accessor: 'amount',
      render: (row) => (
        <div className="text-right">₹{row.amount}</div>
      )
    },
    {
      header: 'Admin Commission (10%)',
      accessor: 'commission',
      render: (row) => (
        <div className="text-right text-green-600 font-bold">
          ₹{(row.amount * 0.1).toFixed(2)}
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-hidden">
      <div className="w-full md:w-60 flex-shrink-0">
        <Sidebar />
      </div>
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 1, sm: 2 }, 
        backgroundColor: '#f8f9fa', 
        height: '100vh',
        overflow: 'auto',
        width: { xs: '100%', md: 'calc(100% - 240px)' }
      }}>
        <Container maxWidth="xl" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ 
            mb: 4, 
            color: '#2c3e50', 
            fontWeight: 500,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
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
                ₹{(adminEarning * 0.1).toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Based on 10% commission rate
              </Typography>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
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
                   {count}
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
                   ₹{(adminEarning/count).toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Card sx={{ 
            borderRadius: '10px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            overflow: 'auto'
          }}>
            <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#2c3e50',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                Commission Earnings History
              </Typography>
              <div className="overflow-auto">
                <div className="min-w-[800px]"> {/* Minimum width to prevent table squishing */}
                  <DataTable 
                    columns={columns}
                    data={history}
                    emptyMessage="No commission earnings found"
                    headerClassName="bg-gray-50 sticky top-0 z-10"
                    rowClassName="hover:bg-gray-50 transition-colors border-b border-gray-200"
                  />
                </div>
              </div>
              {history.length > 0 && (
                <Box sx={{ mt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </div>
  );
};

export default Wallet;