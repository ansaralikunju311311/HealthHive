import axios from 'axios';
import cookie from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL;

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
export const adminLogin = async (data) => {
  
    const response = await apiadmin.post('/admin/login', data, {
      withCredentials: true
    });
    return response.data;
 
};
export const adminDash = async () => {
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/usercount');
    return response.data;
  
}
export const getDepartments = async (currentPage, limit = 10) => {
  
    const response = await apiadmin.get('/admin/department', {
      params: {
        page: currentPage,
        limit
      }
    });
    return response.data;
 
}
export const updateDepartment = async (id) => {
  
    const response = await apiadmin.put(`/admin/department/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
 
}
export const addDepartment = async (Departmentname,Description) => {
  
    const response = await apiadmin.post('/admin/department', {Departmentname,Description}, {
      withCredentials: true
    });
    return response.data;
 
}
export const doctorList = async(currentPage, limit = 10) => {
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
export const getDoctorPayment = async(currentPage, limit = 10)=>{
  
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
export const pendingDoctors = async(currentPage, limit = 10,search=searchTerm)=>{
  
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
export const patientAction= async(id)=>
{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.put(`/admin/unblockpatient/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
}
export const approveDoctor = async(id)=>{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.put(`/admin/approve-doctor/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
 
}
export const rejectedDoctor = async(id)=>{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.put(`/admin/reject-doctor/${id}`, {}, {
      withCredentials: true
    });
    return response.data;
 
} 
export const getPatients = async(currentPage,limit=10)=>{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/patients', {
      params: {
        page: currentPage,
        limit
      }
    });
    return response.data;
 
}
export const adminEarnings = async(currentPage,limit=10)=>{
  
    const token = getadminToken();
    if (!token) ({path:'/admin'});
    const response = await apiadmin.get('/admin/admin-earnings', {
      params: {
        page: currentPage,
        limit
      }
    });
    return response.data;
 

}
export const appoimentGraph = async(filter)=>
{
  console.log("filter",filter)
  const token = getadminToken();
  if (!token) ({path:'/admin'});
  const response = await apiadmin.get(`/admin/revenue/${filter}`);
  return response.data;
}
export const userReport = async (filter) => {
  const token = getadminToken();
  if (!token) ({path:'/admin'});
  const response = await apiadmin.get(`/admin/userdoctor/${filter}`);
  return response.data;
};
// export const salesData