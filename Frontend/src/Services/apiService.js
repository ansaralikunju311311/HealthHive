import axios from 'axios';
import cookie from 'js-cookie';

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
});

apiuser.interceptors.request.use(config => {
  const token = getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


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
  
    const response = await apiuser.post('/user/login', credentials);
    return response.data;
  
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
  
    const response = await apiuser.get(`/user/appointments/${departments}`);  // Changed from '/doctor/appointments'
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



const getDoctorToken = () => cookie.get('doctortoken');

const apidoctor = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});


apidoctor.interceptors.request.use(config => {
  const token = getDoctorToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const verifyDoctorToken = async () => {
  try {
    const token = getDoctorToken();
    if (!token) {
      throw new Error('No token found');
    }
    const response = await apidoctor.get('/doctor/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials:true,
    });
    return response.data;
  }
  catch (error) {
    if(error.response?.status === 401){
      cookie.remove('doctortoken', { path: '/doctor/login' });
      localStorage.removeItem('doctorId');
    }
    console.error(error);
  }
}


export const DoctorSignUp = async (doctorData) => {
  
    const response = await apidoctor.post('/doctor/signup', doctorData, {
      withCredentials: true
    });
    return response.data;
 
}

export const DoctorLogin = async(data,withCredentials=true)=>{
  
    const response = await apidoctor.post('/doctor/login', data, {
      withCredentials
    });
    return response.data;

  }
export const logoutDoctor = async () => {
  
    await apidoctor.post('/doctor/logout');
 

}
export const userInfo = async (userId) => {
   
    const response = await apidoctor.get(`/doctor/userinfo/${userId}`);
    return response.data;
  
}
export const chatHistory = async (doctorId,userId) => {
  
    const response = await apidoctor.get(`/doctor/chats/${doctorId}/${userId}`);
    return response.data;
 
}
export const schedules = async (doctorId,appointmentData) => {
  console.log("appointmentData",appointmentData)
  
       const response = await apidoctor.post(`/doctor/schedule/${doctorId}`,{
         appointments:appointmentData
       });
       return response.data;
 
}

export const ExstingSchedules = async(doctorId)=>{
  
    const response = await apidoctor.get(`/doctor/existing-schedules/${doctorId}`);
    return response.data;
 
}


export const DrAppoinments = async (doctorId) => {
  console.log("working properly")
  const response = await apidoctor.get(`/doctor/appointments/${doctorId}`);
  return response.data;
}
export const appoimentDetails = async (doctorId)=>
{
  
    const response = await apidoctor.get(`/doctor/appoimentdetails/${doctorId}`);
    return response.data;
 
}



export const DrupdateDoctorProfile = async (id, consultFee, about) => {
  const response = await apidoctor.put(`/doctor/profile/${id}`, {
    consultFee,
    about
  });
  return response.data;
};



export const doctorVerification = async(doctoremail)=>
{
  
    const response = await apidoctor.get(`/doctor/get-doctor?email=${doctoremail}`);
    return response.data;
 
}
export const DrProfile = async(doctorId)=>{
  
    const response = await apidoctor.get(`/doctor/profile/${doctorId}`);
    return response.data;
  
}

export const getwalletBalance = async(id,page,limit=10)=>{
  
    const response = await apidoctor.get(`/doctor/doctor-wallet-balance/${id}`,{
      params:{
        page,
        limit
      }
    }
    );
    return response.data;
 
}



const getadminToken = () => cookie.get('admintoken');


const apiadmin = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiadmin.interceptors.request.use(config => {
  const token = getadminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiadmin.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      cookie.remove('usertoken', { path: '/' });
      localStorage.removeItem('userId');
    }
    return Promise.reject(error);
  }
);



export const verifyAdminToken = async () => {
  try {
    const token = getadminToken();
    if (!token) return { user: null };
    const response = await apiadmin.get('/admin/verify-token');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      cookie.remove('admintoken', { path: '/' });
      return { user: null };
    }
    handleApiError(error, 'Token verification failed');
  }
};
export const AdminLogin = async (data) => {
  
    const response = await apiadmin.post('/admin/login', data, {
      withCredentials: true
    });
    return response.data;
 
};
export const AdminDash = async () => {
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/usercount');
    return response.data;
  
}
export const Departments = async (currentPage, limit = 10) => {
  
    const response = await apiadmin.get('/admin/department', {
      params: {
        page: currentPage,
        limit
      }
    });
    return response.data;
 
}
export const UpdateDepartment = async (id) => {
  
    const response = await apiadmin.put(`/admin/department/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
 
}
export const AddDepartment = async (Departmentname,Description) => {
  
    const response = await apiadmin.post('/admin/department', {Departmentname,Description}, {
      withCredentials: true
    });
    return response.data;
 
}
export const DoctorList = async(currentPage, limit = 10) => {
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/doctors', {
      params: {
        page: currentPage,
        limit
      }
    });
    
    const startIndex = (currentPage - 1) * limit;
    
    const doctorsWithSerialNumbers = response.data.doctorsWithIndex.map((doctor, index) => ({
      ...doctor,
      serialNumber: startIndex + index + 1
    }));

    return {
      ...response.data,
      doctorsWithIndex: doctorsWithSerialNumbers
    };
 
}
export const handleAction = async(id)=>
{
 
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.put(`/admin/blockdoctor/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
 
}
export const Getdoctorpayment = async(currentPage, limit = 10)=>{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/getdoctorpayments', {
      params: {
        page: currentPage,
        limit
      }
    });
    return response.data;
   
}
export const PendingDoctors = async(currentPage, limit = 10,search=searchTerm)=>{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/pending-doctors', {
      params: {
        page: currentPage,
        limit,
        search
      }
    });
    return response.data;
 
}
export const PatientAction= async(id)=>
{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.put(`/admin/unblockpatient/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
}