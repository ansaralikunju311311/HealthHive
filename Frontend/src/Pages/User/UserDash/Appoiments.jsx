import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import Homebutton from '../../../Component/User/HomeButton/Homebutton';
import cookies from 'js-cookie';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  styled,
  Avatar,
  Chip,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import Pagination from '../../../Components/Common/Pagination';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f8fafc',
  color: '#1e293b',
  fontSize: '0.875rem',
  padding: '16px',
}));

const Appointments = () => {
  const token = cookies.get('usertoken');
  const [appointments, setAppointments] = useState([]);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);
  const userId = JSON.parse(localStorage.getItem('userId'))._id;

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (pageNumber = currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/getappointments/${userId}`,{
        params: {
          page: pageNumber,
          limit: itemsPerPage
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
      );
      setAppointments(response.data.appointments);
      setTotalPages(response.data.pagination.totalPages);
      
      // If we get an empty page and we're not on page 1, go to previous page
      if (response.data.appointments.length === 0 && pageNumber > 1) {
        fetchAppointments(pageNumber - 1);
        return;
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChat = (doctorId,userId) => {
    navigate('/user/chats', { state: { doctorId, userId } }); 
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        marginLeft: '256px', // Add margin to account for sidebar width
        marginTop: '1rem'    // Add top margin for spacing
      }}>
        {/* Home Button with gradient */}
        <Box sx={{ mb: 3 }}>
          <Homebutton sx={{ 
            background: 'linear-gradient(to right, #3b82f6, #4f46e5)',
            '&:hover': {
              background: 'linear-gradient(to right, #2563eb, #4338ca)',
            },
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
          }} />
        </Box>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            color: '#1e293b', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          My Appointments
        </Typography>

        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Doctor</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow 
                  key={appointment._id}
                  sx={{ 
                    '&:hover': { bgcolor: '#f1f5f9' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={appointment.doctor.image} 
                        alt={appointment.doctor.name}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 'medium' }}>
                          {appointment.doctor.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {appointment.doctor.email}  
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.doctor.specialization} 
                      sx={{ 
                        bgcolor: '#e2e8f0',
                        color: '#475569',
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#1e293b' }}>
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.time}
                      size="small"
                      sx={{ 
                        bgcolor: '#bfdbfe',
                        color: '#1e40af',
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleChat(appointment.doctor._id, appointment.user)}
                      startIcon={<ChatIcon />}
                      sx={{ 
                        bgcolor: '#3b82f6',
                        '&:hover': { bgcolor: '#2563eb' },
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: 'none'
                      }}
                    >
                      Chat with Doctor
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {appointments.length === 0 && (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              color: '#64748b'
            }}>
              <Typography variant="h6">No appointments found</Typography>
              <Typography variant="body2">Your upcoming appointments will appear here</Typography>
            </Box>
          )}
        </TableContainer>
        {appointments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Appointments;