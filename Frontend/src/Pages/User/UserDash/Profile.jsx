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
      <div className="md:block">
        <Sidebar activePage="Profile" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 md:mb-6">
            <HomeButton className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-4 md:mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500">
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{userData.name}</h1>
                <p className="text-lg text-gray-600 mb-1">{userData.email}</p>
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-blue-800 font-medium">Active Member</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-lg text-gray-800 font-medium">{userData.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-lg text-gray-800 font-medium">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-lg text-gray-800 font-medium">{userData.phone}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                  <p className="text-lg text-gray-800 font-medium">{userData.age}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
                  <p className="text-lg text-gray-800 font-medium">{userData.bloodGroup}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <p className="text-lg text-gray-800 font-medium">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile