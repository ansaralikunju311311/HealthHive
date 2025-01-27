import React from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';
import {
  FaUsers,
  FaUserMd,
  FaHospital,
  FaWallet,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
} from 'react-icons/fa';

const Sidebar = ({ activePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem('admintoken');
    cookies.remove('admintoken');
    navigate('/admin');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FaTachometerAlt,
      path: '/admin-dashboard',
    },
    {
      title: 'Doctor Verification',
      icon: FaUserCheck,
      path: '/admin/doctor-verification',
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
      title: 'Doctor Payment',
      icon: FaWallet,
      path: '/admin/doctor-payment',
    },
  ];

  return (
    <div className="w-64 bg-[#1a2b4b] text-white h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-2xl font-bold text-blue-400">HealthHive</h2>
      </div>
      <nav className="mt-6 px-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-4 py-3 text-left ${
              activePage === item.path
                ? 'bg-blue-800 text-white'
                : 'text-gray-300 hover:bg-blue-800 hover:text-white'
            } rounded-lg transition-all mb-2`}
          >
            <item.icon className="mr-3" />
            {item.title}
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
  );
};

export default Sidebar;
