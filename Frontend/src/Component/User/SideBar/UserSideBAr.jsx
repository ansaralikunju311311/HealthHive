import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  MdDashboard, 
  MdEventAvailable,
  MdExitToApp 
} from 'react-icons/md';
import { logoutUser } from '../../../Services/userServices/userApiService';

const Sidebar = ({ activePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.info('You have been logged out', { icon: '👋' });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      navigate('/login');
    }
  };

  const sidebarItems = [
    { 
      icon: <MdDashboard className="w-5 h-5 md:w-6 md:h-6" />, 
      text: 'Profile', 
      path: '/user/Profile',
      id: 'profile'
    },
    { 
      icon: <MdEventAvailable className="w-5 h-5 md:w-6 md:h-6" />, 
      text: 'Appointments',
      path: '/user/appointments',
      id: 'appointments'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-2 left-2 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">HealthHive</h1>
          </div>

          <nav className="flex-1 px-2 md:px-4 pb-4 space-y-2">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 rounded-lg py-2 px-3 md:py-3 md:px-4 cursor-pointer transition-all duration-200 
                  ${location.pathname === item.path
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {item.icon}
                <span className="text-sm md:text-base font-medium">{item.text}</span>
              </div>
            ))}
          </nav>

          <div className="p-2 md:p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <MdExitToApp className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;