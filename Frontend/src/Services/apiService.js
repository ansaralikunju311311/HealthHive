import axios from 'axios';
import cookie from 'js-cookie';

const BASE_URL = 'http://localhost:5000/api';

// Helper functions
const getUserToken = () => cookie.get('usertoken');

const handleApiError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

// Create axios instance with default config
const apiuser = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor
apiuser.interceptors.request.use(config => {
  const token = getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiuser.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      cookie.remove('usertoken', { path: '/' });
      localStorage.removeItem('userId');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const verifyUserToken = async () => {
  try {
    const token = getUserToken();
    if (!token) return { user: null };
    const response = await apiuser.get('/user/verify-token');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      cookie.remove('usertoken', { path: '/' });
      return { user: null };
    }
    handleApiError(error, 'Token verification failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiuser.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    await apiuser.post('/user/logout');
  } finally {
    cookie.remove('usertoken', { path: '/' });
    localStorage.removeItem('userId');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiuser.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Registration failed');
  }
};

// Department APIs
export const getDepartments = async () => {
  try {
    const response = await apiuser.get('/user/departments');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch departments');
  }
};

// Specialties API
export const getSpecialties = async () => {
  try {
    const response = await apiuser.get('/user/specialties');//
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch specialties');
  }
};

// Doctor APIs
export const getAboutDoctors = async () => {
  try {
    const response = await apiuser.get('/user/Aboutdoctors');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch doctor information');
  }
};

export const getDoctorsDetails = async () => {
  try {
    const response = await apiuser.get('/user/doctorsdetails');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch doctor details');
  }
};

export const getPublicDoctors = async () => {
  try {
    const response = await apiuser.get('/user/publicdoctors');
    return response.data;
  } catch (error) {
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await apiuser.post('/user/verify-payment', {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

export const initiatePayment = async (amount) => {
  try {
    const response = await apiuser.post('/user/pay', { 
      amount: parseInt(amount), // Ensure amount is sent as a number
      currency: 'INR'
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to initiate payment');
  }
};

export const getDoctorSlots = async (doctorId, date) => {
  try {
    const response = await apiuser.get(`/doctor/slots/${doctorId}`, {//
      params: { date }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch doctor slots');
  }
};

// Appointment APIs
export const getAppointments = async (departments) => {
  try {
    const response = await apiuser.get(`/user/appointments/${departments}`);  // Changed from '/doctor/appointments'
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch appointments');
  }
};

export const getUserAppointments = async (userId, pageNumber, itemsPerPage) => {
  try {
    const response = await apiuser.get(`/user/getappointments/${userId}`, { params: { pageNumber, itemsPerPage } });  // Changed from '/doctor/appointments/:userId'
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user appointments');
  }
};

export const bookAppointment = async (doctorId, userId, appointmentData) => {
  try {
    // Send request to the correct endpoint with correct params
    const response = await apiuser.post(`/user/book-appointments/${doctorId}/${userId}`, {
      slots: {
        date: appointmentData.slots.date,
        time: appointmentData.slots.time
      },
      transactionData: appointmentData.transactionData,
      status: appointmentData.status
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to book appointment');
  }
};

// Chat APIs
export const getDoctorInfo = async (doctorId) => {
  try {
    const response = await apiuser.get(`/user/doctorinfo/${doctorId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch doctor information');
  }
};

export const getChatHistory = async (doctorId, userId) => {
  try {
    const response = await apiuser.get(`/user/Chats/${doctorId}/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch chat history');
  }
};

// OTP APIs
export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiuser.post('/user/verify-otp', { email, otp: otp.trim() });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await apiuser.post('/user/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

export const getOtpRemainingTime = async (email) => {
  try {
    const response = await apiuser.get('/user/otp-remaining-time', {   
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch remaining time');
  }
};






//

const getDoctorToken = () => cookie.get('doctortoken');

// const handleApiError = (error, defaultMessage) => {
//   if (error.response?.data?.message) {
//     throw new Error(error.response.data.message);
//   }
//   throw new Error(defaultMessage);
// };

// Create axios instance with default config
const apidoctor = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor
apidoctor.interceptors.request.use(config => {
  const token = getDoctorToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apidoctor.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      cookie.remove('doctortoken', { path: '/' });
      localStorage.removeItem('doctorId');
    }
    return Promise.reject(error);
  }
);


