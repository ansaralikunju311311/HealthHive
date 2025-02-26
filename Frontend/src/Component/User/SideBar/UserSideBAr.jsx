import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  MdDashboard, 
  MdEventAvailable,
  MdSchedule,
  MdChat,
  MdAccountBalanceWallet,
  MdExitToApp 
} from 'react-icons/md';

const Sidebar = ({activePage}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = localStorage.getItem('userId');
  console.log(id)

  const handleLogout = async () => {
    try {
      const token = cookies.get('usertoken');
      
      // Optional: Call backend logout endpoint if needed
      await axios.post('http://localhost:5000/api/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

      // Remove doctor token
      cookies.remove('usertoken', { path: '/' });
      localStorage.removeItem('userId');
      // Show logout toast
      toast.info('You have been logged out', {
        icon: '👋.'
      });
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);

      // Fallback logout even if backend call fails
      cookies.remove('usertoken', { path: '/' });
      localStorage.removeItem('userId');
      navigate('/login');
    }
  };

  const sidebarItems = [
    { 
      icon: <MdDashboard className="w-6 h-6" />, 
      text: 'Profile', 
      path: '/user/Profile',
      id: 'profile'
    },
    { 
      icon: <MdEventAvailable className="w-6 h-6" />, 
      text: 'Appointments',
      path: '/user/appointments',
      id: 'appointments'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-xl fixed left-0 top-0 h-screen">
      <div className="p-6 space-y-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800">HealthHive</h1>
        </div>
        
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-3 rounded-lg py-3 px-4 cursor-pointer transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
              }`}
            >
              <div className={`${
                location.pathname === item.path 
                  ? 'transform scale-110' 
                  : ''
              }`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full text-left text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-lg transition-all duration-200"
          >
            <MdExitToApp className="w-6 h-6" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;