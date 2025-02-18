import React from 'react';
import NavBar from '../../../Common/NavBar';
import Footer from '../../../Common/Footer';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';

const shine = keyframes`
  to {
    background-position: 200% center;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  margin: '40px auto',
  borderRadius: '24px',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  position: 'relative',
  overflow: 'hidden',
  background: '#ffffff',
  backdropFilter: 'blur(10px)',
  animation: `${fadeIn} 0.6s ease-out`,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(247,250,255,0.7) 100%)',
    zIndex: 0,
    pointerEvents: 'none'
  }
}));

const GradientText = styled(Typography)`
  background: linear-gradient(90deg, #1a56db 0%, #3b82f6 50%, #1a56db 100%);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${shine} 3s linear infinite;
  text-shadow: 0 2px 10px rgba(26, 86, 219, 0.1);
`;

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(59, 130, 246, 0.05)',
    transform: 'translateX(5px)'
  }
}));

const AmountRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  '&.total': {
    '& .MuiTypography-root': {
      fontWeight: 600,
      fontSize: '1.1rem',
    }
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  animation: `${pulseAnimation} 2s infinite`,
  animationPlayState: 'paused',
  '&:hover': {
    animationPlayState: 'running'
  }
}));

const PayementPanel = () => {
    const location = useLocation();
  const doctorData = location.state?.doctorData;
  const slot = location.state?.slot;




  console.log("slot",slot)
    const userId = JSON.parse(localStorage.getItem('userId'));
    console.log("=========here user",userId._id)
    const navigate = useNavigate();
  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/pay', {
        amount: doctorData?.consultFee
      });

      const options = {
        key: "rzp_test_R1PIEzD9jZhBnz", 
        amount: response.data.amount,
        currency: response.data.currency,
        name: "HealthHive",
        description: `Consultation with Dr. ${doctorData?.name}`,
        order_id: response.data.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResponse = await axios.post('http://localhost:5000/api/user/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResponse.status === 200) {
              // Payment successful and verified
              console.log("Payment successful and verified:", verificationResponse.data);
             


              try {
                const appointmentData = {
                    slots: {
                        date: slot.appointmentDate,
                        time: slot.slotTime
                    }
                };
                
                const appointment = await axios.post(
                    `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId._id}`,
                    appointmentData
                );

                if (appointment.status === 200) {
                    toast.success('Appointment booked successfully!');
                    setTimeout(() => {
                        navigate('/home');
                    }, 2000);
                }
              } catch (error) {
                console.error("Error booking appointment:", error);
                toast.error('Failed to book appointment');
              }




            //   navigate('/home')
            


              // Here you can:
              // 1. Show success message
              // 2. Create appointment
              // 3. Redirect to appointments page
              
              toast.success('Payment successful! Appointment confirmed.');
              // Add navigation to appointment confirmation or listing page
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: "Patient",
          email: "patient@example.com",
          contact: ""
        },
        theme: {
          color: "#3b82f6"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled');
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        toast.error('Payment failed. Please try again.');
      });

    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error('Could not initiate payment. Please try again.');
    }
  };

  
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ 
        padding: { xs: 2, md: 4 }, 
        minHeight: 'calc(100vh - 200px)',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.97) 100%),
          url('https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg?w=1380&t=st=1708231140~exp=1708231740~hmac=6d43a8cda952b5a6cd05c1c8e99e5c7c9ee93c8468f0961c2d43f8166a2f8c89')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }
        }} />

        <StyledPaper elevation={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
            <Avatar
              sx={{
                width: 110,
                height: 110,
                margin: '0 auto 20px',
                bgcolor: 'primary.main',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                border: '4px solid white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(5deg)',
                }
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <GradientText variant="h4" gutterBottom sx={{ 
              fontWeight: 800,
              letterSpacing: '-0.5px',
              mb: 2
            }}>
              Appointment Summary
            </GradientText>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              mb: 3
            }}>
              <Chip
                icon={<SecurityIcon sx={{ color: '#059669' }} />}
                label="Secure Payment"
                variant="outlined"
                color="success"
                sx={{ 
                  borderRadius: '12px',
                  background: 'rgba(5, 150, 105, 0.1)',
                  borderColor: 'rgba(5, 150, 105, 0.3)',
                  '& .MuiChip-label': {
                    fontWeight: 500
                  }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ 
            mb: 4,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '24px',
            padding: 3,
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
              zIndex: 0
            }
          }}>
            <InfoRow>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 60,
                height: 60,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
              }}>
                <LocalHospitalIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Doctor
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {doctorData?.name}
                  <CheckCircleIcon sx={{ color: '#059669', fontSize: 20 }} />
                </Typography>
              </Box>
            </InfoRow>

            <InfoRow>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 60,
                height: 60,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
              }}>
                <EventIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Date
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {slot?.appointmentDate}
                </Typography>
              </Box>
            </InfoRow>

            <InfoRow sx={{ mb: 0 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 60,
                height: 60,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
              }}>
                <AccessTimeIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Time
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {slot?.slotTime}
                </Typography>
              </Box>
            </InfoRow>
          </Box>

          <Box sx={{ 
            bgcolor: '#ffffff', 
            p: 4, 
            borderRadius: '24px',
            mb: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(26, 86, 219, 0.1)'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, rgba(26, 86, 219, 0.2) 0%, rgba(26, 86, 219, 0) 60%)',
              zIndex: 0
            }} />
            
            <AmountRow>
              <Typography sx={{ 
                fontWeight: 600, 
                fontSize: '1rem',
                color: '#1e293b'
              }}>
                Consultation Fee
              </Typography>
              <Typography sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                color: '#1e293b'
              }}>
                ₹{doctorData?.consultFee}
              </Typography>
            </AmountRow>
            <AmountRow>
              <Typography sx={{ 
                fontWeight: 600, 
                fontSize: '1rem',
                color: '#1e293b'
              }}>
                Platform Fee
              </Typography>
              <Typography sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                color: '#10b981'
              }}>
                ₹0
              </Typography>
            </AmountRow>
            <Divider sx={{ 
              my: 3,
              borderStyle: 'solid',
              borderColor: 'rgba(26, 86, 219, 0.2)',
              borderWidth: '1px'
            }} />
            <AmountRow className="total">
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800,
                  color: '#0f172a',
                  fontSize: '1.25rem'
                }}
              >
                Total Amount
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontWeight: 800,
                    lineHeight: 1,
                    mb: 0.5,
                    letterSpacing: '-0.5px',
                    background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 10px rgba(26, 86, 219, 0.2)'
                  }}
                >
                  ₹{doctorData?.consultFee}
                </Typography>
                <Typography sx={{ 
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  Including all taxes
                </Typography>
              </Box>
            </AmountRow>
          </Box>

          <AnimatedButton
            variant="contained"
            fullWidth
            size="large"
            startIcon={<LockIcon />}
            sx={{
              borderRadius: '16px',
              textTransform: 'none',
              fontSize: '1.2rem',
              py: 2.5,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
            onClick={handlePayment}
          >
            Proceed to Pay
          </AnimatedButton>

          {/* Bottom Security Note */}
          <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{
              display: 'flex',
              gap: 4,
              justifyContent: 'center',
              width: '100%',
              mb: 2,
              '& img': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  opacity: '0.8 !important'
                }
              }
            }}>
              <img 
                src="https://razorpay.com/build/browser/static/razorpay-logo-white-no-shadow.6a1ecee6.svg" 
                alt="Razorpay"
                style={{ height: '28px', filter: 'grayscale(100%)', opacity: 0.6 }}
              />
              <Divider orientation="vertical" flexItem />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                alt="Visa"
                style={{ height: '28px', filter: 'grayscale(100%)', opacity: 0.6 }}
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                alt="Mastercard"
                style={{ height: '28px', filter: 'grayscale(100%)', opacity: 0.6 }}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#64748b',
              background: 'rgba(100, 116, 139, 0.05)',
              padding: '8px 16px',
              borderRadius: '100px'
            }}>
              <VerifiedUserIcon sx={{ fontSize: 20 }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Your payment is protected by bank-level security
              </Typography>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default PayementPanel;