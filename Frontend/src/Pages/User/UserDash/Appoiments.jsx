import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAppointments } from '../../../Services/apiService';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import Homebutton from '../../../Component/User/HomeButton/Homebutton';
import cookies from 'js-cookie';
import {
  Box,
  Paper,
  Typography,
  Button,
  styled,
  Avatar,
  Chip,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { Chat as ChatIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import Pagination from '../../../Components/Common/Pagination';
import DataTable from '../../../Components/Common/DataTable';

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
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async (pageNumber = currentPage) => {
    try {
      const response = await getUserAppointments(userId, pageNumber, itemsPerPage);
      setAppointments(response.appointments);
      setTotalPages(response.pagination.totalPages);
      
      // If we get an empty page and we're not on page 1, go to previous page
      if (response.appointments.length === 0 && pageNumber > 1) {
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

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  // Define columns for DataTable
  const columns = [
    {
      header: 'Doctor',
      accessor: 'doctor',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={row.doctor.profileImage} 
            alt={row.doctor.name}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 'medium' }}>
              {row.doctor.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {row.doctor.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      header: 'Department',
      accessor: 'doctor.specialization',
      render: (row) => (
        <Chip 
          label={row.doctor.specialization} 
          sx={{ 
            bgcolor: '#e2e8f0',
            color: '#475569',
            fontWeight: 'medium'
          }}
        />
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <Typography variant="body2" sx={{ color: '#1e293b' }}>
          {new Date(row.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      )
    },
    {
      header: 'Time',
      accessor: 'time',
      render: (row) => (
        <Chip 
          label={row.time}
          size="small"
          sx={{ 
            bgcolor: '#bfdbfe',
            color: '#1e40af',
            fontWeight: 'medium'
          }}
        />
      )
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => handleChat(row.doctor._id, row.user)}
            startIcon={<ChatIcon />}
            sx={{ 
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 'none'
            }}
          >
            Chat
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleViewDetails(row)}
            startIcon={<VisibilityIcon />}
            sx={{ 
              borderColor: '#3b82f6',
              color: '#3b82f6',
              '&:hover': { 
                bgcolor: '#eff6ff',
                borderColor: '#2563eb' 
              },
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            View Details
          </Button>
        </Box>
      )
    }
  ];

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

        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <DataTable 
            columns={columns}
            data={appointments}
            emptyMessage={
              <Box sx={{ p: 4, textAlign: 'center', color: '#64748b' }}>
                <Typography variant="h6">No appointments found</Typography>
                <Typography variant="body2">Your upcoming appointments will appear here</Typography>
              </Box>
            }
            headerClassName="bg-gray-50"
            rowClassName="hover:bg-gray-50 transition-colors"
          />
        </Paper>

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

      {/* Add Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          color: '#1e293b',
          fontWeight: 'bold'
        }}>
          Appointment Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedAppointment && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar 
                    src={selectedAppointment.doctor.profileImage} 
                    alt={selectedAppointment.doctor.name}
                    sx={{ width: 64, height: 64 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 'bold' }}>
                      Dr. {selectedAppointment.doctor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {selectedAppointment.doctor.specialization}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                  Appointment Date
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 'medium' }}>
                  {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                  Appointment Time
                </Typography>
                <Chip 
                  label={selectedAppointment.time}
                  sx={{ 
                    bgcolor: '#bfdbfe',
                    color: '#1e40af',
                    fontWeight: 'medium'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                  Consultation Fee
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 'medium' }}>
                  ₹{selectedAppointment.doctor.consultFee}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                  Department
                </Typography>
                <Chip 
                  label={selectedAppointment.doctor.specialization}
                  sx={{ 
                    bgcolor: '#e2e8f0',
                    color: '#475569',
                    fontWeight: 'medium'
                  }}
                />
              </Grid>

              {selectedAppointment.doctor.about && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                    Doctor's Note
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {selectedAppointment.doctor.about}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e2e8f0' }}>
          <Button 
            onClick={handleCloseModal}
            variant="outlined"
            sx={{ 
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': { 
                bgcolor: '#f1f5f9',
                borderColor: '#94a3b8' 
              },
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => handleChat(selectedAppointment.doctor._id, selectedAppointment.user)}
            variant="contained"
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointments;