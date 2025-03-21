import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaInfoCircle, FaEnvelope, FaChevronDown, FaUserCircle, FaUser, FaFileAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { verifyUserToken, logoutUser } from '../Services/userServices/userApiService';

const NavBar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user } = await verifyUserToken();
        setUserData(user);
      } catch (error) {
        if (!error.response || error.response.status !== 401) {
          console.error('Error fetching user data:', error);
        }
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserData(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text hover:from-teal-400 hover:to-blue-600 transition-all duration-300">
              HealthHive
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            <FaBars className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8 lg:space-x-12">
            <button 
              onClick={() => navigate(userData ? '/home' : '/')} 
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
            >
              <FaHome className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </button>
            
            {userData ? (
              <button 
                onClick={() => navigate('/appointment')} 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
              >
                <FaCalendarAlt className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Appointments</span>
              </button>
            ) : null}
            
            <button 
              onClick={() => navigate('/about')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
            >
              <FaInfoCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>About</span>
            </button>
            
            <button 
              onClick={() => navigate('/contact')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg group"
            >
              <FaEnvelope className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Contact Us</span>
            </button>
          </div>

          {/* Profile/Auth Section */}
          <div className="hidden md:flex items-center">
            {userData ? (
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
                        <span>Profile</span>
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
                        onClick={handleLogout}
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
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <button 
            onClick={() => navigate(userData ? '/home' : '/')}
            className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FaHome className="h-5 w-5" />
            <span>Home</span>
          </button>
          {userData && (
            <button 
              onClick={() => navigate('/user/appointments')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaCalendarAlt className="h-5 w-5" />
              <span>Appointments</span>
            </button>
          )}
          <button 
            onClick={() => navigate('/about')}
            className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FaInfoCircle className="h-5 w-5" />
            <span>About</span>
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FaEnvelope className="h-5 w-5" />
            <span>Contact Us</span>
          </button>
        </div>
        {userData && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center">
              {userData?.image ? (
                <img src={userData.image} alt="Profile" className="h-8 w-8 rounded-full" />
              ) : (
                <FaUserCircle className="h-8 w-8 text-blue-500" />
              )}
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{userData?.name}</div>
                <div className="text-xs text-gray-500">{userData?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => navigate('/user/profile')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;