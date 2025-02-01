import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Footer from '../Common/Footer'
import StayConnected from '../Common/StayConnected'
// import { setUser, logout } from '../redux/Features/userSlice';
import { FaUserCircle, FaHome, FaCalendarAlt, FaInfoCircle, FaEnvelope, FaChevronDown, FaUser, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Bannerdoctor from '../../assets/Bannerdoctor.png';
import DoctorOne from '../../assets/Doctorone.png';
import DoctorTwo from '../../assets/doctortwo.png';
import DoctorThree from '../../assets/doctorthree.png';
import DoctorFour from '../../assets/doctorfour.png';
import cookies from 'js-cookie';
const HomePageUser = () => {
  const [userData, setUserData] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [doctorsData, setDoctorsData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    console.log("useeffectvjfnjfnjnfjfjfjfjcalled");
    const verifyToken = async () => {
      try {
        const token = cookies.get('useraccessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setUserData(response.data.user);
        const response1 = await axios.get('http://localhost:5000/api/user/doctorsdetails', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setDoctorsData(response1.data.doctors);
        console.log("doctors data=====", response1.data.doctors);
       
        setLoading(false); // Add this line to stop loading once data is received

        if(response.data.user.isBlocked && response.data.user.isActive) {
          cookies.remove('useraccessToken');
          toast.error('Your account has been blocked', {
            backgroundColor: '#ef4444',
            icon: '⛔'
          });
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error("Auth error:", error); // Add this for debugging
        if (error.response?.status === 401) {
          cookies.remove('useraccessToken');
          navigate('/login');
        }
        setError('Authentication failed');
        setLoading(false); // Add this to stop loading on error
      }
    };
    verifyToken();
  }, [dispatch, navigate]);

  const handleLogout = () => {
    cookies.remove('useraccessToken');
    toast.error('Logged out successfully', {
      backgroundColor: '#ef4444',
      icon: '👋'
    });
    navigate('/');
  };

  const navigationToasts = {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text hover:from-teal-400 hover:to-blue-600 transition-all duration-300">
                HealthHive
              </span>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-12">
              <button 
                onClick={() => navigate('/home')} 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              >
                <FaHome className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </button>
              
              <button 
                onClick={() => navigate('/user/appointments')} 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              >
                <FaCalendarAlt className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Appointments</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              >
                <FaInfoCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>About</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              >
                <FaEnvelope className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </button>
            </div>

            {/* User Profile */}
            <div className="relative flex items-center" ref={profileRef}>
              <div className="flex items-center">
                {userData?.image ? (
                  <img 
                    src={userData.image} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
                  />
                ) : (
                  <FaUserCircle className="h-10 w-10 text-blue-500" />
                )}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center p-2 ml-1 rounded-full hover:bg-blue-50 transition-all duration-200"
                >
                  <FaChevronDown 
                    className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                      isProfileOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-32 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                      >
                        <FaChevronDown 
                          className="h-4 w-4 text-gray-600 transform rotate-180"
                        />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/user/profile');
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FaUser className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </div>
                    <FaChevronDown 
                      className="h-3 w-3 text-gray-400 transform rotate-180"
                    />
                  </button>
                  <button
                    onClick={() => {
                      navigate('/user/medical-records');
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <FaFileAlt className="h-4 w-4" />
                      <span>Medical Records</span>
                    </div>
                    <FaChevronDown 
                      className="h-3 w-3 text-gray-400 transform rotate-180"
                    />
                  </button>
                  <div className="border-t border-gray-100 mt-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        // setIsProfileOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt className="h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                      <FaChevronDown 
                        className="h-3 w-3 text-red-400 transform rotate-180"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 py-3 space-y-1">
            <button 
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => navigate('/user/appointments')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaCalendarAlt className="h-5 w-5" />
              <span>Appointments</span>
            </button>
            <button 
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>About</span>
            </button>
            <button 
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaEnvelope className="h-5 w-5" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome back!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Book appointments, view your medical records, and manage your healthcare journey all in one place.
              </p>
              <button 
                onClick={() => navigate('/user/book-appointment')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg"
              >
                Book Appointment
              </button>
            </div>
            <div>
              <img src={Bannerdoctor} alt="Healthcare Professional" className="w-full rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Book Appointment',
                description: 'Schedule a consultation with our expert doctors',
                action: () => navigate('/user/book-appointment')
              },
              { 
                title: 'View Records',
                description: 'Access your medical history and test results',
                action: () => navigate('/user/medical-records')
              },
              { 
                title: 'Update Profile',
                description: 'Keep your personal information up to date',
                action: () => navigate('/user/profile')
              }
            ].map((action, index) => (
              <div 
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      {/* Health Tips */}
      <div className="bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Health Tips & Resources</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "COVID-19 Updates",
                description: "Stay informed about the latest COVID-19 guidelines and vaccination information."
              },
              {
                title: "Healthy Living",
                description: "Tips for maintaining a healthy lifestyle, including diet and exercise recommendations."
              },
              {
                title: "Mental Wellness",
                description: "Resources and support for maintaining good mental health and managing stress."
              }
            ].map((tip, index) => (
              <div key={index} class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h3>
                <p class="text-gray-600">{tip.description}</p>
                <button class="mt-4 text-blue-600 hover:text-blue-800">Learn More →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stay Connected Form */}
      <StayConnected />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePageUser;