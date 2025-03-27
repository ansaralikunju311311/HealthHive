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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage="Profile" />
      
      <div className="flex-1 md:ml-64 transition-all duration-300"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <HomeButton className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200" />
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"> 
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                  <img
                    src={userData.image || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{userData.name}</h1>
                <p className="text-base sm:text-lg text-gray-600 mb-3">{userData.email}</p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full shadow-sm">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm sm:text-base text-blue-800 font-medium">Active Member</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                <InfoField label="Full Name" value={userData.name} icon="user" />
                <InfoField label="Email Address" value={userData.email} icon="mail" />
                <InfoField label="Phone Number" value={userData.phone} icon="phone" />
              </div>
              <div className="space-y-6">
                <InfoField label="Age" value={userData.age} icon="calendar" />
                <InfoField label="Blood Group" value={userData.bloodGroup} icon="droplet" />
                <InfoField label="Address" value={userData.address} icon="map-pin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoField = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200">
    <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center">
      {icon && (
        <span className="mr-2">
          <i data-feather={icon} className="w-4 h-4"></i>
        </span>
      )}
      {label}
    </label>
    <p className="text-base sm:text-lg text-gray-900 font-medium">{value || '-'}</p>
  </div>
);

export default Profile