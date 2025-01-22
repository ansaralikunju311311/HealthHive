import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './Components/LandingPage'
// import SignUp from './Components/SignUp'
// import Login from './Components/Login'
import SignUp from './Components/User/SignUp'
import Login from './Components/User/Login'
import GenerateOtp from './Components/User/GenerateOtp'
// import VerifyOtp from './Components/User/VerifyOtp'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    
      <Route path="/generate-otp" element={<GenerateOtp />} />      
    </Routes>
  )
}
export default App
