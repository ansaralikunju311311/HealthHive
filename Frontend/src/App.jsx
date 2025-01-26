import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Protected } from './Components/User/UserProtcted/Protected'  
import LandingPage from './Components/LandingPage'
import SignUp from './Components/User/SignUp'
import Login from './Components/User/Login'
import GenerateOtp from './Components/User/GenerateOtp'
import Admin from './Components/admin/Admin'
import AdminDashboard from './Components/admin/AdminDashboard'
import DoctorVerification from './Components/admin/DoctorVerification'
import ForgotPassword from './Components/User/ForgotPassword'
import ResetPassword from './Components/User/ResetPassword'
import DoctorSignUp from './Components/Doctor/SignUp'
import DoctorLogin from './Components/Doctor/Login'
import Patients from './Components/admin/Patients'
import Doctor from './Components/admin/Doctor'
import BeforeVerification from './Components/Doctor/BeforeVerifcation'
import HomePageUser from './Components/User/HomePageUser'
import DoctorDash from './Components/Doctor/DoctorDash'
import AdminProtected from './Components/admin/Protected/AdminProtected';
// import NavBar from './Components/Common/NavBaar';

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generate-otp" element={<GenerateOtp />} />      
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <Protected>
            <HomePageUser />
          </Protected>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor-signup" element={<DoctorSignUp />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/before-verification" element={<BeforeVerification />} />
        <Route path="/doctor-dashboard" element={<DoctorDash />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-dashboard" element={
          <AdminProtected>
            <AdminDashboard />
          </AdminProtected>
        } />
        <Route path="/admin/doctors" element={
          <AdminProtected>
            <Doctor />
          </AdminProtected>
        } />
        <Route path="/admin/patients" element={
          <AdminProtected>
            <Patients />
          </AdminProtected>
        } />
        <Route path="/admin/doctor-verification" element={
          <AdminProtected>
            <DoctorVerification />
          </AdminProtected>
        } />
        {/* <Route path="/navbar" element={<NavBar />} /> */}
      </Routes>
    </>
  )
}

export default App
