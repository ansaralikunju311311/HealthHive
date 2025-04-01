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
  MdExitToApp,
  MdFeedback 
} from 'react-icons/md';
import { logoutDoctor } from '../../Services/doctorService/doctorService';

const Sidebar = ({activePage, doctorid}) => {
  const id = doctorid;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
     
      await logoutDoctor();
      
      toast.info('You have been logged out', {
        icon: '👋'
      });
      
      navigate('/doctor/login');
    } catch (error) {
      console.error('Error logging out:', error);
      cookies.remove('doctortoken', { path: '/' });
      localStorage.removeItem('doctorId');
      navigate('/doctor/login');
    }
  };

  const sidebarItems = [
    { 
      icon: <MdDashboard className="w-6 h-6" />, 
      text: 'Dashboard', 
      path: '/doctor/dashboard',
      id: 'dashboard'
    },
    { 
      icon: <MdEventAvailable className="w-6 h-6" />, 
      text: 'Appointments',
      path: '/doctor/appointment',
      id: 'appointment'
    },
    { 
      icon: <MdSchedule className="w-6 h-6" />, 
      text: 'Current Schedules',
      path: `/schedules`,
      id: 'schedules',
      state: {doctorid: id}
    },
   
    { 
      icon: <MdAccountBalanceWallet className="w-6 h-6" />, 
      text: 'Wallet',
      path: '/doctor/wallet',
      id: 'wallet'
    },
    {
      icon:<MdFeedback className="w-6 h-6"/>,
      text: 'Feedback',
      path: '/doctor/feedback',
      id: 'feedback',
      state:{doctorid:id}
    }
  ];

  return (
    <div className="w-64 bg-white shadow-xl fixed left-0 top-0 h-screen transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 md:z-30
      max-md:w-[250px] max-md:-translate-x-full">
      <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">HealthHive</h1>
          <button className="md:hidden text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
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
        
        <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
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
    </div>
  );
};

export default Sidebar;