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
// import VerifyOtp from './Components/User/VerifyOtp'
import DoctorSignUp from './Components/Doctor/SignUp'
import DoctorLogin from './Components/Doctor/Login'
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
      
    
    </Routes>
  )
}
export default App
