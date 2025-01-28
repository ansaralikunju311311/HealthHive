import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    console.log("useeffectvjfnjfnjnfjfjfjfjcalled");
    const verifyToken = async () => {
      try {
        console.log("useeffefjnfngfjgnfjgnfjgnfjgnfjgnfjctvjfnjfnjnfjfjfjfjcalled");
        // const token = localStorage.getItem('useraccessToken');
        const token = cookies.get('useraccessToken');
        console.log("token from the cookie   home pahe=====",token);
        if (!token) {
          toast.error('Please login to continue');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/verify-token', {
       

          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true,
        });
        console.log("from the backend data",response.data.user)
        setUserData(response.data.user);
        // dispatch(setUser(response.data.user));
        toast.success('Welcome back ' + response.data.user.name);
        setLoading(false);
        if(response.data.user.isBlocked===true && response.data.user.isActive===true){
          cookies.remove('useraccessToken');
          navigate('/login');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          // dispatch(logout());
          // localStorage.removeItem('useraccessToken');
          cookies.remove('useraccessToken');
          navigate('/login');
        }
        setError('Authentication failed');
        toast.error('Authentication failed');
        setLoading(false);
      }
    };
    verifyToken();
  }, [dispatch, navigate]);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // dispatch(logout());
    // localStorage.removeItem('useraccessToken');
    cookies.remove('useraccessToken');
    navigate('/');
  };

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
                onClick={() => {
                  navigate('/home');
                  toast.info('Welcome to Home');
                }} 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              >
                <FaHome className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </button>
              
              <button 
                onClick={() => {
                  navigate('/user/appointments');
                  toast.info('Viewing appointments');
                }} 
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
                      toast.info('Navigating to profile settings');
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
                      toast.info('Viewing medical records');
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
              onClick={() => {
                navigate('/home');
                toast.info('Welcome to Home');
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => {
                navigate('/user/appointments');
                toast.info('Viewing appointments');
              }}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialty: "Cardiologist",
                experience: "15+ Years Experience",
                image: DoctorOne,
                availability: "Available Today"
              },
              {
                name: "Dr. Michael Chen",
                specialty: "Neurologist",
                experience: "12+ Years Experience",
                image: DoctorTwo,
                availability: "Next Available: Tomorrow"
              },
              {
                name: "Dr. Emily Parker",
                specialty: "Pediatrician",
                experience: "10+ Years Experience",
                image: DoctorThree,
                availability: "Available Today"
              },
              {
                name: "Dr. James Wilson",
                specialty: "Orthopedic Surgeon",
                experience: "18+ Years Experience",
                image: DoctorFour,
                availability: "Next Available: Monday"
              }
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600">{doctor.specialty}</p>
                  <p className="text-gray-600 text-sm">{doctor.experience}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {doctor.availability}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/user/book-appointment')}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Health Tips & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
                <button className="mt-4 text-blue-600 hover:text-blue-800">Learn More →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stay Connected Form */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Stay connected with us</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 rounded-md text-gray-900"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-2 rounded-md text-gray-900"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-2 rounded-md text-gray-900"
              ></textarea>
              <button type="submit" className="w-full bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HealthHive</h3>
              <p className="text-gray-400">Your trusted healthcare partner</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency Care</li>
                <li>Dental Care</li>
                <li>Primary Care</li>
                <li>Specialized Treatment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@healthhive.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 Medical Center Dr</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HealthHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePageUser;