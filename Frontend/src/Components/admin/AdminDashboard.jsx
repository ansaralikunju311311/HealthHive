import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaUserMd,
  FaHospital,
  FaWallet,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
  FaMoneyBillWave
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample data for charts
const userGrowthData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 600 },
  { month: 'Mar', users: 800 },
  { month: 'Apr', users: 1000 },
  { month: 'May', users: 1200 },
  { month: 'Jun', users: 1500 },
];

const revenueData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 7000 },
  { month: 'Mar', revenue: 8500 },
  { month: 'Apr', revenue: 10000 },
  { month: 'May', revenue: 12000 },
  { month: 'Jun', revenue: 15000 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a2b4b] text-white h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-blue-400">HealthHive</h2>
        </div>
        <nav className="mt-6 px-4">
          <button 
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/doctor-verification')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaUserCheck className="mr-3" />
            Doctor Verification
          </button>
          <button 
            onClick={() => navigate('/doctors')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaUserMd className="mr-3" />
            Doctors
          </button>
          <button 
            onClick={() => navigate('/departments')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaHospital className="mr-3" />
            Departments
          </button>
          <button 
            onClick={() => navigate('/patients')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaUsers className="mr-3" />
            Patients
          </button>
          <button 
            onClick={() => navigate('/doctor-payment')}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all mb-2"
          >
            <FaWallet className="mr-3" />
            Doctor Payment
          </button>
          <div className="border-t border-blue-800 mt-4 pt-4">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-all"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64"> 
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-2xl font-bold">1,500</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaUserMd className="text-3xl text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Doctors</h3>
                <p className="text-2xl font-bold">50</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-3xl text-yellow-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold">₹57,500</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
