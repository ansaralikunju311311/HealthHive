import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import cookies from 'js-cookie';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './Pages/User/SignUp';
import Login from './Pages/User/Login';
import GenerateOtp from './Pages/User/GenerateOtp';
import HomePageUser from './Pages/User/Home/HomePageUser';
import DoctorSignUp from './Pages/Doctor/SignUp';
import DoctorLogin from './Pages/Doctor/Login';
import DoctorDash from './Pages/Doctor/DoctorDash/DoctorDash.jsx';
import BeforeVerifcation from './Pages/Doctor/BeforeVerifcation';
import Profile from './Pages/Doctor/Profile';
import Protected from './Pages/User/UserProtected/Protected';
import Admin from './Pages/admin/Admin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import ReverseProtected from './Pages/User/UserProtected/ReverseProtected';
import DoctorReve from './Pages/Doctor/Protected/DoctorReve';
import DoctorProtected from './Pages/Doctor/Protected/DoctorProtected';
import AdminProtected from './Pages/admin/Protected/AdminProtected';
import AdminReve from './Pages/admin/Protected/ReverseProtected';
import DoctorVerification from './Pages/admin/DoctorVerification';
import Doctor from './Pages/admin/Doctor';
import Departments from './Pages/admin/Department';
import Patients from './Pages/admin/Patients';
import PasswordReset from './Common/PasswordReset'
import Forgot from './Common/Forgot';
import About from './Pages/User/About/About';
import ContactUs from './Pages/User/ContactUs/ContactUs..jsx'
import Appoiments from './Pages/User/Appoiments/Appoiments.jsx';
import Bookings from './Pages/User/Appoiments/Bookings.jsx';
import DrAppoiments from './Pages/Doctor/DoctorAppoiments/DrAppoiments.jsx';
import Schedules from './Pages/Doctor/CurrentSchedules/Schedules.jsx';
import Slot from './Pages/User/Appoiments/Slot';
import ProfileUser from './Pages/User/UserDash/Profile.jsx'
import UserAppoiments from './Pages/User/UserDash/Appoiments.jsx'
import Doctorpayement from './Pages/admin/Doctorpayement'
import PayementPanel from './Pages/User/Appoiments/PayementPanel'
import Wallet from './Pages/admin/Wallet'
import DrWallet from './Pages/Doctor/Wallet/DrWallet'
import Chat from './Pages/User/UserDash/Chat'
import DrChat from './Pages/Doctor/Chat/Chat'
import { verifyUserToken } from './Services/userServices/userApiService.js';
import ProfileCompletion from './Pages/User/ProfileCompletion.jsx';
import FeedBack from './Pages/Doctor/FeedBack/FeedBack';
const ProtectedRoute = ({ children, wrapper: Wrapper }) => (
  <Wrapper>{children}</Wrapper>
);
const App = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {user} = await verifyUserToken();
        setUserData(user);
        setLoading(false);
      } catch (error) {
       if(!error.response || error.response.status !== 401) {
          console.error(error);
        }
      }
    };
    fetchUserData();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>

        {/* Home Route - Uses HomePageUser for both states */}
        <Route path="/" element={<HomePageUser />} />
        <Route path="/home" element={<ProtectedRoute wrapper={Protected}><HomePageUser /></ProtectedRoute>} />
        <Route path="/appointment" element={<ProtectedRoute wrapper={Protected}><Appoiments /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute wrapper={Protected}><Bookings /></ProtectedRoute>} />
        <Route path="/bookappointment" element={<ProtectedRoute wrapper={Protected}><Slot /></ProtectedRoute>} />

        {/*User Dash Pages  */}
        <Route path="/user/profile" element={<ProtectedRoute wrapper={Protected}><ProfileUser /></ProtectedRoute>} />
        <Route path="/user/appointments" element={<ProtectedRoute wrapper={Protected}><UserAppoiments /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute wrapper={Protected}><PayementPanel /></ProtectedRoute>} />
        <Route path="/user/chats" element={<ProtectedRoute wrapper={Protected}><Chat /></ProtectedRoute>} />

        {/* Auth Routes */}

        <Route path="/user/forgotpassword" element={<Forgot />} />
        <Route path="/doctor/forgotpassword" element={<Forgot />} />
        <Route path="/user/reset-password" element={<PasswordReset />} />
        <Route path="/doctor/reset-password" element={<PasswordReset />} />
        <Route path="/signup" element={<ProtectedRoute wrapper={ReverseProtected}><SignUp /></ProtectedRoute>} />
        <Route path="/login" element={<ProtectedRoute wrapper={ReverseProtected}><Login /></ProtectedRoute>} />
        <Route path="/generate-otp" element={<ProtectedRoute wrapper={ReverseProtected}><GenerateOtp /></ProtectedRoute>} />

        {/* Doctor Routes */}

        <Route path="/doctor/signup" element={<ProtectedRoute wrapper={DoctorReve}><DoctorSignUp /></ProtectedRoute>} />
        <Route path="/doctor/login" element={<ProtectedRoute wrapper={DoctorReve}><DoctorLogin /></ProtectedRoute>} />
        <Route path="/beforeverification" element={<ProtectedRoute wrapper={DoctorReve}><BeforeVerifcation /></ProtectedRoute>} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute wrapper={DoctorProtected}><DoctorDash /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute wrapper={DoctorProtected}><Profile /></ProtectedRoute>} />
        <Route path="/doctor/appointment" element={<ProtectedRoute wrapper={DoctorProtected}><DrAppoiments /></ProtectedRoute>} />
        <Route path="/schedules" element={<ProtectedRoute wrapper={DoctorProtected}><Schedules /></ProtectedRoute>} />
        <Route path="/doctor/wallet" element={<ProtectedRoute wrapper={DoctorProtected}><DrWallet /></ProtectedRoute>} />
        <Route path="/doctor/chats" element={<ProtectedRoute wrapper={DoctorProtected}><DrChat /></ProtectedRoute>} />
        <Route path="/doctor/feedback" element={<ProtectedRoute wrapper={DoctorProtected}><FeedBack /></ProtectedRoute>} />
        
        {/* Admin Routes */}

        <Route path="/admin" element={<ProtectedRoute wrapper={AdminReve}><Admin /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute wrapper={AdminProtected}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/doctorverification" element={<ProtectedRoute wrapper={AdminProtected}><DoctorVerification /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute wrapper={AdminProtected}><Doctor /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute wrapper={AdminProtected}><Departments /></ProtectedRoute>} />
        <Route path="/admin/patients" element={<ProtectedRoute wrapper={AdminProtected}><Patients /></ProtectedRoute>} />
        <Route path="/admin/wallet" element={<ProtectedRoute wrapper={AdminProtected}><Wallet /></ProtectedRoute>} />
        <Route path="/admin/doctorpayement" element={<ProtectedRoute wrapper={AdminProtected}><Doctorpayement /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/profilecompletion" element={<ProfileCompletion />} />
      </Routes>
    </>
  );
};

export default App;
