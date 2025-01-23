import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaUserMd,
  FaHospital,
  FaWallet,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
  FaMoneyBillWave
} from 'react-icons/fa';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
const DoctorVerifcation = () => {

  const navigate = useNavigate();
  return (
    <div>
       <div className="w-64 bg-[#1a2b4b] text-white h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-blue-400">HealthHive</h2>
        </div>
        <nav className="mt-6 px-4">
          <button 
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
           onClick={()=>navigate('/admin-dashboard')} >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/doctor-verification')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaUserCheck className="mr-3" />
            Doctor Verification
          </button>
          <button 
            onClick={() => navigate('/doctors')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaUserMd className="mr-3" />
            Doctors
          </button>
          <button 
            onClick={() => navigate('/departments')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaHospital className="mr-3" />
            Departments
          </button>
          <button 
            onClick={() => navigate('/patients')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaUsers className="mr-3" />
            Patients
          </button>
          <button 
            onClick={() => navigate('/doctor-payment')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaWallet className="mr-3" />
            Doctor Payment
          </button>
          <div className="border-t border-blue-800 mt-4 pt-4">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-all"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default DoctorVerifcation


