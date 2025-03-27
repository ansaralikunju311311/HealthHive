import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAppointments } from '../../../Services/userServices/userApiService';
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
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Chat as ChatIcon, Visibility as VisibilityIcon, Download as DownloadIcon } from '@mui/icons-material';
import Pagination from '../../../Components/Common/Pagination';
import DataTable from '../../../Components/Common/DataTable';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getPrescription } from '../../../Services/userServices/userApiService';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900, 
      lg: 1200,
      xl: 1536,
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f8fafc',
  color: '#1e293b',
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.75rem',
  },
}));

const Appointments = () => {
  const token = cookies.get('usertoken');
  const [appointments, setAppointments] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const userDataFromStorage = JSON.parse(localStorage.getItem('userId'));
  const userId = userDataFromStorage?._id;
  const userName = userDataFromStorage?.name;
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const limit = 10;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      const response = await getUserAppointments(userId, currentPage, limit);
      setAppointments(response.appointments);
      setTotalPages(response.pagination.totalPages);
      if (response.appointments.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };


  const prescription = async (date, time) => {
    const unique = date+time;
    try {
      const response = await getPrescription(unique);
      setPrescriptionData(response);
      setOpenPrescriptionModal(true);
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };

  const handleClosePrescriptionModal = () => {
    setOpenPrescriptionModal(false);
    setPrescriptionData(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChat = (doctorId,userId) => {
    console.log("userName will happen", userName);
    navigate('/user/chats', { state: { doctorId, userId, userName } });
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const generatePDF = () => {
    if (!prescriptionData) return;
    const { doctorDetails, prescription, user } = prescriptionData;
    console.log(prescriptionData);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(30, 144, 255);
    doc.rect(0, 0, pageWidth, 40, "F");

    const logoPath = "/public/logo.png";
    try {
      doc.addImage(logoPath, "PNG", 10, 5, 30, 30);
    } catch (error) {
      console.warn("Could not load logo:", error);
    }

    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("HealthHive", 45, 20);
    doc.setFontSize(14);
    doc.text("Medical Prescription", 45, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    doc.setDrawColor(30, 144, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 45, pageWidth - 20, 45);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Doctor Details:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Dr. ${doctorDetails.name}`, 20, 70);
    doc.text(`Specialization: ${doctorDetails?.specialization?.Departmentname}`, 20, 78);
    doc.text(`Email: ${doctorDetails.email}`, 20, 86);

    doc.setFont("helvetica", "bold");
    doc.text("Patient Details:", pageWidth - 120, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user.name}`, pageWidth - 120, 70);
    doc.text(`Email: ${user.email}`, pageWidth - 120, 78);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 120, 86);

    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis:", 20, 105);
    doc.setFont("helvetica", "normal");
    doc.text(prescription.diagnosis, 20, 115);
    doc.setFont("helvetica", "bold");
    doc.text("Description:", 20, 125);
    doc.setFont("helvetica", "normal");
    
  
    const descriptionLines = doc.splitTextToSize(prescription.description, pageWidth - 40);
    doc.text(descriptionLines, 20, 135);

    const descriptionHeight = descriptionLines.length * 7; 
    const tableStartY = 145 + descriptionHeight;

    const tableColumn = ["Medicine", "Dosage", "Duration"];
    const tableRows = prescription.prescriptions.map((med) => [
      med.medicines,
      med.dosage,
      med.duration,
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { 
        fillColor: [30, 144, 255],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 11,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60 },
        2: { cellWidth: 50 }
      }
    });

    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("This is a digitally generated prescription from HealthHive", pageWidth/2, footerY, { align: "center" });

    // Save the PDF
    doc.save("HealthHive-Prescription.pdf");
  };

  const columns = [
    {
      header: 'S.No',
      accessor: 'serialNumber',
      render: (row) => <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{row.serialNumber}</Typography>,
    },
    {
      header: 'Doctor',
      accessor: 'doctor',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            src={row.doctor.profileImage} 
            sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              noWrap
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {row.doctor.name}
            </Typography>
            {!isMobile && (
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {row.doctor.email}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      header: 'Dept',
      accessor: 'doctor.specialization',
      render: (row) => (
        <Chip 
          label={row.doctor.specialization.Departmentname} 
          size={isMobile ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
        />
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          {new Date(row.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: isMobile ? undefined : 'numeric',
          })}
        </Typography>
      ),
    },
    {
      header: 'Time',
      accessor: 'time',
      render: (row) => (
        <Chip 
          label={row.time}
          size={isMobile ? 'small' : 'medium'}
          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size={isMobile ? 'small' : 'medium'}
            onClick={() => handleChat(row.doctor._id, row.user)}
            startIcon={<ChatIcon />}
            sx={{ minWidth: 0, p: isMobile ? 0.5 : 1 }}
          >
            {!isMobile && 'Chat'}
          </Button>
          <Button
            size={isMobile ? 'small' : 'medium'}
            onClick={() => handleViewDetails(row)}
            startIcon={<VisibilityIcon />}
            variant="outlined"
            sx={{ minWidth: 0, p: isMobile ? 0.5 : 1 }}
          >
            {!isMobile && 'View'}
          </Button>
        </Box>
      ),
    },
    {
      header: 'Prescription',
      accessor: 'prescription', 
      render: (row) => (
        <Button 
          size={isMobile ? 'small' : 'medium'}
          onClick={() => prescription(row.date, row.time)}
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{ minWidth: 0, p: isMobile ? 0.5 : 1 }}
        >
          {!isMobile && 'Prescription'}
        </Button>
      ),
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        <Sidebar activePage="appointments" />
        
        <Box sx={{ 
          flex: 1, 
          p: { xs: 2, sm: 3 }, 
          ml: { md: '256px' },
          mt: { xs: 6, md: 0 }
        }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Homebutton sx={{ 
              p: { xs: 1, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '1rem' }
            }} />
          </Box>

          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3, 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              fontWeight: 'bold'
            }}
          >
            My Appointments
          </Typography>

          <Paper sx={{ 
            borderRadius: 2, 
            overflowX: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <DataTable 
              columns={columns}
              data={appointments}
              emptyMessage={
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    No appointments found
                  </Typography>
                </Box>
              }
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

        <Dialog 
          open={openModal} 
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Appointment Details
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {selectedAppointment && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={selectedAppointment.doctor.profileImage}
                      sx={{ width: { xs: 48, sm: 64 }, height: { xs: 48, sm: 64 } }}
                    />
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        Dr. {selectedAppointment.doctor.name}
                      </Typography>
                      <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {selectedAppointment.doctor.specialization?.Departmentname}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Date
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {new Date(selectedAppointment.date).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Time
                  </Typography>
                  <Chip 
                    label={selectedAppointment.time}
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Fee
                  </Typography>
                  <Typography>₹{selectedAppointment.doctor.consultFee}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Department
                  </Typography>
                  <Chip 
                    label={selectedAppointment.doctor.specialization?.Departmentname}
                    size="small"
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
            <Button
              onClick={() => handleChat(selectedAppointment?.doctor._id, selectedAppointment?.user,userName)}
              startIcon={<ChatIcon />}
            >
              Chat
            </Button>
          </DialogActions>
        </Dialog>

  
        <Dialog
          open={openPrescriptionModal}
          onClose={handleClosePrescriptionModal}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            borderBottom: '1px solid #e2e8f0',
            pb: 2
          }}>
            Prescription Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {prescriptionData && (
              <Grid container spacing={3}>
                {/* Header Section */}
                <Grid item xs={12}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 3
                  }}>
                    {/* Doctor Info */}
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Dr. {prescriptionData.doctorDetails.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prescriptionData.doctorDetails.specialization?.Departmentname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {prescriptionData.doctorDetails.email}
                      </Typography>
                    </Box>
                    {/* Date */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Patient Info */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                      Patient Information
                    </Typography>
                    <Typography variant="body2">
                      Name: {prescriptionData.user.name}
                    </Typography>
                    <Typography variant="body2">
                      Email: {prescriptionData.user.email}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Diagnosis */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                      Diagnosis
                    </Typography>
                    <Typography variant="body2">
                      {prescriptionData.prescription.diagnosis}
                    </Typography>
                    
                  </Paper>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {prescriptionData.prescription.description}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Medicines */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Prescribed Medicines
                    </Typography>
                    <Grid container spacing={2}>
                      {prescriptionData.prescription.prescriptions.map((med, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper sx={{ p: 2, bgcolor: 'white' }}>
                            <Typography variant="subtitle2">
                              {med.medicines}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Dosage: {med.dosage}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Duration: {med.duration}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={handleClosePrescriptionModal}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => generatePDF()}
            >
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Appointments;