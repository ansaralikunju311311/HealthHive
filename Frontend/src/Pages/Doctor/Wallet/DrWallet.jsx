import React, { useEffect ,useState} from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { Box, Card, Typography, Button, Container, Grid, Paper } from '@mui/material';
import axios from 'axios';
import cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../Components/Common/DataTable';
import Pagination from '../../../Components/Common/Pagination';
import { verifyDoctorToken,getwalletBalance } from '../../../Services/doctorService/doctorService';

const DrWallet = () => {
 const limit =10;
  const [walletBalance, setWalletBalance] = useState(0);
  const [doctor, setDoctor] = useState();
  const [history, setHistory] = useState();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = cookies.get('doctortoken');
    if(!token){
      navigate('/doctor/login');
      return;
    }

    const verifyTokenAndFetchData = async () => {
      try {
       
        const response = await verifyDoctorToken();
        const doctorData = response.doctor;
        console.log("Doctor data from response:", doctorData);
        setDoctor(doctorData);

        const id = doctorData._id;
       

   const balance = await getwalletBalance(id,currentPage,limit);

        setWalletBalance(balance.walletBalance);
        setHistory(balance.history);
        setTotalPages(balance.pagination.totalPages);
        setCurrentPage(balance.pagination.currentPage);
        
        
      } catch (error) {
        console.log(error);
        navigate('/doctor/login');
      }
    };

    verifyTokenAndFetchData();
  },[currentPage]);

  // Define columns for DataTable
  const columns = [
    {
      header: 'Sl No',
      accessor: 'index',
      render: (row) => row.index+ 0
    },
    {
      header: 'Patient Name',
      accessor: 'userName',
      render: (row) => row.userName || 'N/A'
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => row.date ? 
        new Date(row.date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : 'N/A'
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => `₹${row.amount || 0}`
    }
  ];

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                
                {/* Replace Table with DataTable */}
                <DataTable 
                  columns={columns}
                  data={history || []}
                  emptyMessage="No transactions found"
                  headerClassName="bg-gray-50"
                  rowClassName="hover:bg-gray-50 transition-colors"
                />

                {/* Replace custom pagination with Pagination component */}
                {history && history.length > 0 && (
                  <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DrWallet;