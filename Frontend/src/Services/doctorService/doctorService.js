import axios from 'axios'
import cookie from 'js-cookie'
const BASE_URL = import.meta.env.VITE_API_URL;

const getDoctorToken = () => cookie.get('doctortoken');

const token = cookie.get('doctortoken');
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
    console.log("error",error)
    console.error(error);
  }
}


export const doctorSignUp = async (doctorData) => {
  
    const response = await apidoctor.post('/doctor/signup', doctorData, {
      withCredentials: true
    });
    return response.data;
 
}

export const doctorLogin = async(data)=>{
  try {
    const response = await apidoctor.post('/doctor/login', data, {
      withCredentials: true
    });
    
    // Set the token in cookie if login successful
    if (response.data?.token) {
      cookie.set('doctortoken', response.data.token, { path: '/' });
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
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
export const schedule = async (doctorId,appointmentData) => {
  
       const response = await apidoctor.post(`/doctor/schedule/${doctorId}`,{
         appointments:appointmentData
       });
       return response.data;
 
}

export const exstingSchedules = async(doctorId)=>{
  
    const response = await apidoctor.get(`/doctor/existing-schedules/${doctorId}`);
    return response.data;
 
}


export const drAppoinments = async (doctorId) => {
  const response = await apidoctor.get(`/doctor/appointments/${doctorId}`);
  return response.data;
}
export const appoimentDetails = async (doctorId)=>
{
  
    const response = await apidoctor.get(`/doctor/appoimentdetails/${doctorId}`);
    return response.data;
 
}



export const drupdateDoctorProfile = async (id, consultFee, about) => {
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
export const drProfile = async(doctorId)=>{
  
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
export const getDepartments = async()=>{
  
    const response = await apidoctor.get('/doctor/departments');
    return response.data;
 
}


export const getDashboardData = async (doctorId, filter) => {
  const response = await apidoctor.get(`/doctor/dashboard/${doctorId}/${filter}`);
  return response.data;
};

export const sendPrescription = async (doctorId, userId, data,uniquePre) => {
  const response = await apidoctor.post(`/doctor/prescription/${doctorId}/${userId}/${uniquePre}`, data);
  return response.data;
};
export const feedBack = async (doctorId) => {
  const response = await apidoctor.get(`/doctor/feedback/${doctorId}`);
  return response.data;
};
