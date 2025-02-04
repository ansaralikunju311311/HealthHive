import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Common/Footer';
import StayConnected from '../../../Components/User/StayConnected';
import NavBar from '../../../Common/NavBar';
import Hero from '../../../Components/User/Hero';
import cookies from 'js-cookie';
import Service from '../../../Components/User/Service';
import DentalSignUp from '../../../Components/User/DentalSignUp';
import Specialties from '../../../Components/User/Specialties';
import QuickAction from '../../../Components/User/QuickAction';
import HealthTips from '../../../Components/User/HealthTips';
import Department from '../../../Components/User/Department.jsx';
const HomePageUser = () => {
  const navigate = useNavigate();
  const [doctorsDataW, setDoctorsDataW] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = cookies.get('usertoken');
        
        if (token) {
          try {
            // Verify token and get user data
            const userResponse = await axios.get('http://localhost:5000/api/user/verify-token', {
              headers: {
                Authorization: `Bearer ${token}`
              },
              withCredentials: true,
            });
            setUserData(userResponse.data.user);

            // Fetch doctors data only if user is authenticated
            const doctorsResponse = await axios.get('http://localhost:5000/api/user/doctorsdetails', {
              headers: {
                Authorization: `Bearer ${token}`
              },
              withCredentials: true,
            });
            setDoctorsData(doctorsResponse.data.doctors);

            // const departmentsResponse = await axios.get('http://localhost:5000/api/admin/department', {
            //   headers: {
            //     Authorization: `Bearer ${token}`
            //   },
            //   withCredentials: true,
            // });
            // setDepartments(departmentsResponse.data);
            // console.log("departments=====", departmentsResponse.data);
          } catch (error) {
            if (error.response?.status === 401) {
              cookies.remove('useraccessToken');
            }
            console.error("Error fetching user data:", error);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchPublicDoctors = async () => {
      try {
        // Fetch public doctors data for non-authenticated users
        const response = await axios.get('http://localhost:5000/api/user/publicdoctors');
        setDoctorsDataW(response.data.doctors);
      } catch (error) {
        console.error("Error fetching public doctors:", error);
      }
    };

    if (!userData) {
      fetchPublicDoctors();
    } else {
      setDoctorsDataW(doctorsData);
    }
  }, [userData, doctorsData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Non-authenticated user view
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Hero />
        <Specialties />
        <Service />
        <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Available Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorsDataW && doctorsDataW.length > 0 ? doctorsDataW.map((doctor, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={doctor.profileImage} 
                    alt={doctor.name} 
                    className="w-full h-80 object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DoctorOne;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                        {doctor.availability || "Available Today"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 text-sm mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {doctor.availability || "Available Today"}
                  </div>
                  <div className="flex items-center justify-center text-gray-600 text-sm mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {doctor.yearsOfExperience}+ years of experience
                  </div>

                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center group"
                  >
                    Book Appointment
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500">
                No doctors available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
        <DentalSignUp />
        <StayConnected />
        <Footer />
      </div>
    );
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Hero />
      <QuickAction />
     <Department/>
      {/* Available Doctors */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Available Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorsData && doctorsData.length > 0 ? doctorsData.map((doctor, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={doctor.profileImage} 
                    alt={doctor.name} 
                    className="w-full h-80 object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DoctorOne;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                        {doctor.availability || "Available Today"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 text-sm mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {doctor.availability || "Available Today"}
                  </div>
                  <div className="flex items-center justify-center text-gray-600 text-sm mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {doctor.yearsOfExperience}+ years of experience
                  </div>

                  <button 
                    onClick={() => navigate('/user/book-appointment')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center group"
                  >
                    Book Appointment
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500">
                No doctors available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>

      <HealthTips />
      <DentalSignUp />
      <StayConnected />
      <Footer />
    </div>
  );
};

export default HomePageUser;