import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './Components/LandingPage';
import SignUp from './Components/User/SignUp';
import Login from './Components/User/Login';
import GenerateOtp from './Components/User/GenerateOtp';
import Admin from './Components/admin/Admin';
import AdminDashboard from './Components/admin/AdminDashboard';
import DoctorVerification from './Components/admin/DoctorVerification';
import DoctorSignUp from './Components/Doctor/SignUp';
import DoctorLogin from './Components/Doctor/Login';
import Patients from './Components/admin/Patients';
import Doctor from './Components/admin/Doctor';
import BeforeVerification from './Components/Doctor/BeforeVerifcation';
import HomePageUser from './Components/User/HomePageUser';
import DoctorDash from './Components/Doctor/DoctorDash';
import AdminProtected from './Components/admin/Protected/AdminProtected';
import DoctorProtected from './Components/Doctor/Protected/DoctorProtected';
import ReverseProtected from './Components/User/UserProtcted/Protctedun';
import ResetPassword from './Components/Common/PasswordReset';
import ForgotPassword from './Components/Common/Forgot';
import DcotorReve from './Components/Doctor/Protected/RevProtected';
import AdminReve from './Components/admin/Protected/ReverseProtected';
import Protected from './Components/User/UserProtcted/Protected';
import Profile from './Components/Doctor/Profile';
import Department from './Components/admin/Department';
const ProtectedRoute = ({ children, wrapper: Wrapper }) => (
  <Wrapper>{children}</Wrapper>
);

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ProtectedRoute wrapper={ReverseProtected}><LandingPage /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute wrapper={ReverseProtected}><SignUp /></ProtectedRoute>} />
        <Route path="/login" element={<ProtectedRoute wrapper={ReverseProtected}><Login /></ProtectedRoute>} />
        <Route path="/generate-otp" element={<ProtectedRoute wrapper={ReverseProtected}><GenerateOtp /></ProtectedRoute>} />
        <Route path="/user/forgotpassword" element={<ProtectedRoute wrapper={ReverseProtected}><ForgotPassword /></ProtectedRoute>} />
        <Route path="/doctor/forgotpassword" element={<ProtectedRoute wrapper={ReverseProtected}><ForgotPassword /></ProtectedRoute>} />
        <Route path="/user/reset-password" element={<ProtectedRoute wrapper={ReverseProtected}><ResetPassword /></ProtectedRoute>} />
        <Route path="/doctor/reset-password" element={<ResetPassword />} />

        {/* User Protected Routes */}
        <Route path="/home" element={<ProtectedRoute wrapper={Protected}><HomePageUser /></ProtectedRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor/signup" element={<ProtectedRoute wrapper={DcotorReve}><DoctorSignUp /></ProtectedRoute>} />
        <Route path="/doctor/login" element={<ProtectedRoute wrapper={DcotorReve}><DoctorLogin /></ProtectedRoute>} />
        <Route path="/beforeverification" element={<ProtectedRoute wrapper={DcotorReve}><BeforeVerification /></ProtectedRoute>} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute wrapper={DoctorProtected}><DoctorDash /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute wrapper={DoctorProtected}><Profile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute wrapper={AdminReve}><Admin /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute wrapper={AdminProtected}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute wrapper={AdminProtected}><Doctor /></ProtectedRoute>} />
        <Route path="/admin/patients" element={<ProtectedRoute wrapper={AdminProtected}><Patients /></ProtectedRoute>} />
        <Route path="/admin/doctorverification" element={<ProtectedRoute wrapper={AdminProtected}><DoctorVerification /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute wrapper={AdminProtected}><Department /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
