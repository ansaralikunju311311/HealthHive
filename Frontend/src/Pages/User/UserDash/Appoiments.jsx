import * as React from 'react';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const Appoiments = () => {
  // Sample data - replace with your actual data
  const appointments = [
    {
      id: 1,
      doctorName: 'Dr. John Smith',
      date: '2025-02-12',
      time: '10:00 AM',
      status: 'Scheduled'
    },
    // Add more appointments as needed
  ];

  const handleCancel = (id) => {
    // Add your cancel logic here
    console.log('Cancelling appointment:', id);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
          My Appointments
        </Typography>
        
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="appointments table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Doctor Name</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleCancel(appointment.id)}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Reschedule
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Appoiments;