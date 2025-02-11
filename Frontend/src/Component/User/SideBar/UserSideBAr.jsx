import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const id = localStorage.getItem('userId');
  console.log(id)
  const navigate = useNavigate();
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
      text: 'Dashboard', 
      path: '/user/dashboard',
      active: true 
    },
    { 
      icon: <MdEventAvailable className="w-6 h-6" />, 
      text: 'Appointments',
      path: '/user/appointment' 
    },
    { 
      icon: <MdSchedule className="w-6 h-6" />, 
      text: 'Current Schedules',
      path: `/schedules`, 
    //   state: {userid: id}
    },
    { 
      icon: <MdChat className="w-6 h-6" />, 
      text: 'Chats',
      path: '/user/chats' 
    },
  ];
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 space-y-4">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center space-x-3 ${
              item.active
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            } rounded-lg py-3 px-4 cursor-pointer transition-colors`}
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
        
        <div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full text-left text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-lg transition-colors"
          >
            <MdExitToApp className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;