import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VerifyUserToken } from '../../../Services/apiService'
import Bannerdoctor from '../../../assets/Bannerdoctor.png'

const Hero = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await VerifyUserToken();
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            {userData ? (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome back, {userData.name}!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Book appointments, view your medical records, and manage your healthcare journey all in one place.
                </p>
                <button 
                  onClick={() => navigate('/appointment')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg"
                >
                  Book Appointment
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome back!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Book appointments, view your medical records, and manage your healthcare journey all in one place.
                </p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg"
                >
                  Login
                </button>
              </>
            )}
          </div>
          <div>
            <img src={Bannerdoctor} alt="Healthcare Professional" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero