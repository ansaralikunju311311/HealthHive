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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Homebutton from '../../../Component/User/HomeButton/Homebutton';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const Appoiments = () => {
    const user = JSON.parse(localStorage.getItem('userId'));
    console.log("==========================",user._id);
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([])
  // Sample data - replace with your actual data
//   const appointments = [
//     {
//       id: 1,
//       doctorName: 'Dr. John Smith',
//       department: 'Cardiology',
//       date: '2025-02-12',
//       time: '10:00 AM',
//       status: 'Scheduled'
//     },
//     // Add more appointments as needed
//   ];

useEffect(() => {
    const FetchAppoiments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/getappointments/${user._id}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }
    FetchAppoiments();
}, []); // Empty dependency array to run only once

  const handleCancel = async (appointmentId) => {
    // try {
    //     await axios.delete(`http://localhost:5000/api/user/cancelappointment/${appointmentId}`);
    //     // Remove the cancelled appointment from the state
    //     setAppointments(prevAppointments => 
    //         prevAppointments.filter(appointment => appointment._id !== appointmentId)
    //     );
    // } catch (error) {
    //     console.error('Error cancelling appointment:', error);
    // }
    console.log("====",appointmentId)
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 0 }}>
            My Appointments
          </Typography>
          <Homebutton />
        </Box>
        
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="appointments table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Doctor Name</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Time</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                console.log("====appp",appointment),
                <TableRow
                  key={appointment._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{appointment.doctor.name}</TableCell>
                  <TableCell>{appointment.doctor.specialization}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleCancel(appointment._id)}
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