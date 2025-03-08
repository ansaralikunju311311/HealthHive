import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import {
  FaUsers,
  FaUserMd,
  FaHospital,
  FaWallet,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Sidebar = ({ activePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove('admintoken');
    navigate('/admin');
    toast.error('Logged out successfully', {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FaTachometerAlt,
      path: '/admin/dashboard',
    },
    {
      title: 'Doctor Verification',
      icon: FaUserCheck,
      path: '/admin/doctorverification',
    },
    {
      title: 'Doctors',
      icon: FaUserMd,
      path: '/admin/doctors',
    },
    {
      title: 'Departments',
      icon: FaHospital,
      path: '/admin/departments',
    },
    {
      title: 'Patients',
      icon: FaUsers,
      path: '/admin/patients',
    },
    {
      title: 'Wallet',
      icon: FaWallet,
      path: '/admin/wallet',
    },
    {
      title: 'Doctor Payment',
      icon: FaWallet,
      path: '/admin/doctorpayement',
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`
        md:w-64 bg-[#1a2b4b] text-white 
        fixed md:static top-0 left-0 h-screen
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        z-40
      `}>
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl md:text-2xl font-bold text-blue-400">HealthHive</h2>
        </div>
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-left ${
                activePage === item.path
                  ? 'bg-blue-800 text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              } rounded-lg transition-all mb-2`}
            >
              <item.icon className="mr-3" />
              <span className="text-sm md:text-base">{item.title}</span>
            </button>
          ))}
          <div className="border-t border-blue-800 mt-4 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-all"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
