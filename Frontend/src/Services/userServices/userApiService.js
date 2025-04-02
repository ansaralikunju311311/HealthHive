import axios from 'axios'
import cookie from 'js-cookie'
const BASE_URL = import.meta.env.VITE_API_URL;

const getUserToken = () => cookie.get('usertoken');

const handleApiError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(defaultMessage);
};

const apiuser = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiuser.interceptors.request.use(config => {
  const token = getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiuser.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      cookie.remove('usertoken', { path: '/' });
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const verifyUserToken = async () => {
  try {
    console.log("token jddjdj")
    const token = getUserToken();
    console.log("token jddjdj",token)

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
      console.log("login user",credentials)
    const response = await apiuser.post('/user/login', credentials);
    
    console.log("login response",response)
    // Set the token in cookie if login successful
    if (response.data?.userToken) {
      console.log("token set",response.data.userToken)
      cookie.set('usertoken', response.data.userToken, { path: '/' });
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    handleApiError(error, 'Login failed');
  }
};

export const logoutUser = async () => {
  
    await apiuser.post('/user/logout');
  
    cookie.remove('usertoken', { path: '/' });
    localStorage.removeItem('userId');

};

export const registerUser = async (userData) => {
  
    const response = await apiuser.post('/user/signup', userData);
    return response.data;

};

export const getDepartments = async () => {
  
    const response = await apiuser.get('/user/departments');
    return response.data;
 
};

export const getSpecialties = async () => {
  
    const response = await apiuser.get('/user/specialties');//
    return response.data;
  
};

export const getAboutDoctors = async () => {
  
    const response = await apiuser.get('/user/Aboutdoctors');
    return response.data;
 
};

export const getDoctorsDetails = async () => {
  
    const response = await apiuser.get('/user/doctorsdetails');
    return response.data;

};

export const getPublicDoctors = async () => {
  
    const response = await apiuser.get('/user/publicdoctors');
    return response.data;
  
};

export const verifyPayment = async (paymentData) => {
  
    const response = await apiuser.post('/user/verify-payment', {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
    });
    return response.data;
  
};

export const initiatePayment = async (amount) => {
  
    const response = await apiuser.post('/user/pay', { 
      amount: parseInt(amount), 
      currency: 'INR'
    });
    return response.data;
  
};  

export const getDoctorSlots = async (doctorId, date) => {
  
    const response = await apiuser.get(`/doctor/slots/${doctorId}`, {//
      params: { date }
    });
    return response.data;
 
};

export const getAppointments = async (departments) => {


  console.log("departments",departments)  
  
    const response = await apiuser.get(`/user/appointments/${departments}`);  
    console.log(response)
    return response.data;
  
};

export const getUserAppointments = async (userId, pageNumber, limit) => {
  
    const response = await apiuser.get(`/user/getappointments/${userId}`, { params: { page:pageNumber, limit } });  // Changed from '/doctor/appointments/:userId'
    console.log("debugiing ========",response.data);
    return response.data;
  
};

export const bookAppointment = async (doctorId, userId, appointmentData) => {
  
    const response = await apiuser.post(`/user/book-appointments/${doctorId}/${userId}`, {
      slots: {
        date: appointmentData.slots.date,
        time: appointmentData.slots.time
      },
      transactionData: appointmentData.transactionData,
      status: appointmentData.status
    });
    return response.data;
 
};


export const getDoctorInfo = async (doctorId) => {
  
    const response = await apiuser.get(`/user/doctorinfo/${doctorId}`);
    return response.data;
 
};

export const getChatHistory = async (doctorId, userId) => {
  
    const response = await apiuser.get(`/user/Chats/${doctorId}/${userId}`);
    return response.data;
  
};


export const verifyOtp = async (email, otp) => {
  
    const response = await apiuser.post('/user/verify-otp', { email, otp: otp.trim() });
    if (response.data?.userToken) {
      cookie.set('usertoken', response.data.userToken, { path: '/' });
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
      }
    }
    return response.data;
  
};

export const resendOtp = async (email) => {
  
    const response = await apiuser.post('/user/resend-otp', { email });
    return response.data;
 
};

export const getOtpRemainingTime = async (email) => {
  
    const response = await apiuser.get('/user/otp-remaining-time', {   
      params: { email }
    });
    return response.data;
  
};

export const googleLogin = async (email, uid) => {
  try {
    const response = await apiuser.post('/user/google-login', { email, uid });
    
    if (!response.data?.userToken) {
      throw new Error('No authentication token received');
    }

    // Set the token in cookie
    cookie.set('usertoken', response.data.userToken, { 
      path: '/',
      secure: true,
      sameSite: 'Lax'
    });

    // Store user ID if available
    if (response.data.userId) {
      localStorage.setItem('userId', response.data.userId);
    }

    // Verify the token was set
    const storedToken = cookie.get('usertoken');
    if (!storedToken) {
      throw new Error('Failed to store authentication token');
    }

    return response.data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export const profileCompletion = async (data) => {
  
    const response = await apiuser.post('/user/profile-completion', data,{
      withCredentials: true
    });
    return response.data;
  
};
export const googleSignup = async (email,uid,name)=>{
  const response = await apiuser.post('/user/google-signup', { email, uid,name });
  return response.data;
};
export const getPrescription = async (unique) => {
  const response = await apiuser.get(`/user/prescription/${unique}`);
  return response.data;
};
export const feedBack = async ({ userId, doctorId, feedbackRating, feedbackComment }) => {
  try {
    const response = await apiuser.post('/user/feedback', {
      userId,
      doctorId,
      feedbackRating,
      feedbackComment
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};