import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Protected } from './Components/Protected/Protected'  
import LandingPage from './Components/LandingPage'
// import SignUp from './Components/SignUp'
// import Login from './Components/Login'
import SignUp from './Components/User/SignUp'
import Login from './Components/User/Login'
import GenerateOtp from './Components/User/GenerateOtp'
import Admin from './Components/admin/Admin'
import AdminDashboard from './Components/admin/AdminDashboard'
import DoctorVerification from './Components/admin/DoctorVerification'
import ForgotPassword from './Components/User/ForgotPassword'
// import VerifyOtp from './Components/User/VerifyOtp'
import ResetPassword from './Components/User/ResetPassword'
import DoctorSignUp from './Components/Doctor/SignUp'
import DoctorLogin from './Components/Doctor/Login'
import Patients from './Components/admin/Patients'
import Doctor from './Components/admin/Doctor'
// import BeforeVerification from './Components/Doctor/BeforeVerification'
import BeforeVerification from './Components/Doctor/BeforeVerifcation'
const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={
        <Protected>
          <LandingPage />
        </Protected>
      } /> */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    
      <Route path="/generate-otp" element={<GenerateOtp />} />      
      <Route path="/doctor-signup" element={<DoctorSignUp />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/doctors" element={<Doctor />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/doctor-verification" element={<DoctorVerification />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/before-verification" element={<BeforeVerification />} />
    
    </Routes>
  )
}
export default App
