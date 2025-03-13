import React, { useEffect } from 'react'
import Sidebar from '../../../Component/User/SideBar/UserSideBAr'
import { useNavigate } from 'react-router-dom'
import HomeButton from '../../../Component/User/HomeButton/Homebutton'

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem('userId')) || {};
  console.log("user====",userData)
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Sidebar activePage="Profile" />
      
      <div className="flex-1 p-4 md:p-8 md:ml-64 pt-16 md:pt-8"> 
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 md:mb-6">
            <HomeButton className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-24 h-24 md:w-32 md:h-32"> 
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500">
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{userData.name}</h1>
                <p className="text-base md:text-lg text-gray-600 mb-1">{userData.email}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm md:text-base text-blue-800 font-medium">Active Member</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
               
                <InfoField label="Full Name" value={userData.name} />
                <InfoField label="Email Address" value={userData.email} />
                <InfoField label="Phone Number" value={userData.phone} />
              </div>
              <div className="space-y-4 md:space-y-6">
                <InfoField label="Age" value={userData.age} />
                <InfoField label="Blood Group" value={userData.bloodGroup} />
                <InfoField label="Address" value={userData.address} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <p className="text-base md:text-lg text-gray-800 font-medium">{value}</p>
  </div>
);

export default Profile