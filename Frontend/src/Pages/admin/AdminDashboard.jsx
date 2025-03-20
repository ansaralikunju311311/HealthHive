import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import cookies from 'js-cookie'
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
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
import Sidebar from './Sidebar';
import { adminDash, getDashboardData } from '../../Services/adminService/adminService';

const AdminDashboard = () => {
  const handleFilter = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter); 
  };
  
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filter, setFilter] = useState('today');
  const [dashboardData, setDashboardData] = useState({
    labels: [],
    revenueData: [],
    userData: [],
    doctorData: []
  });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminDash();
        console.log("usercount=====", response.data);
        setUserCount(response?.userCount + response?.doctorCount);
        setDoctorCount(response?.doctorCount);
        setTotalAmount(response?.totalAmount);
      } catch (error) {
        console.error("Error fetching user count:", error);
        toast.error('Failed to fetch user count');
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(filter);
        setDashboardData(response.data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch dashboard data');
      }
    };
    fetchDashboardData();
  }, [filter]);
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 10, 10);
    let y = 20;
    doc.text('Time', 10, y);
    doc.text('Sales', 70, y);
    y += 10;
    salesData.forEach(item => {
      doc.text(item.name, 10, y);
      doc.text(String(item.sales), 70, y);
      y += 10;
    });
    doc.save('sales-report.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesReport');
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/admin/dashboard" />

      <div className="flex-1 ml-0 md:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4">
            <h1 className="text-xl md:text-2xl font-semibold">Admin Dashboard</h1>
          </div>
        </header>
        <select 
          className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleFilter}
          value={filter}
        >
          <option value="today">Today</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button 
                className="bg-blue-500 text-white rounded-md px-4 py-2"
                onClick={exportPDF}
              >
                Export PDF
              </button>
              <button 
                className="bg-green-500 text-white rounded-md px-4 py-2"
                onClick={exportExcel}
              >
                Export Excel
              </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-2xl font-bold">{userCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaUserMd className="text-3xl text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Doctors</h3>
                <p className="text-2xl font-bold">{doctorCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-3xl text-yellow-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold">₹{totalAmount*0.1}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">User Growth</h2>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {filter === 'today' ? (
                  <LineChart data={dashboardData.labels.map((label, index) => ({
                    name: label,
                    users: dashboardData.userData[index],
                    doctors: dashboardData.doctorData[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#666' }}
                      interval={2}
                    />
                    <YAxis tick={{ fill: '#666' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => {
                        const key = name.toLowerCase();
                        return key === 'users' ? [value, 'Users'] : key === 'doctors' ? [value, 'Doctors'] : [value, name];
                      }}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="doctors" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Doctors"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={dashboardData.labels.map((label, index) => ({
                    name: label,
                    users: dashboardData.userData[index],
                    doctors: dashboardData.doctorData[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#666' }}
                      interval={filter === 'monthly' ? 2 : 0}
                      angle={filter === 'monthly' ? -45 : 0}
                      textAnchor={filter === 'monthly' ? 'end' : 'middle'}
                      height={filter === 'monthly' ? 60 : 30}
                    />
                    <YAxis tick={{ fill: '#666' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                      formatter={(value, name) => [value, name === 'users' ? 'Users' : 'Doctors']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="users" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                      name="Users"
                    />
                    <Bar 
                      dataKey="doctors" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                      name="Doctors"
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Revenue Growth</h2>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {filter === 'today' ? (
                  <LineChart data={dashboardData.labels.map((label, index) => ({
                    name: label,
                    revenue: dashboardData.revenueData[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#666' }}
                      interval={2}
                      tickFormatter={(value) => value}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#666' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                      labelFormatter={(label) => `Time: ${label}`}
                      cursor={{ stroke: '#e0e0e0' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue"
                      stroke="#059669" 
                      strokeWidth={2}
                      dot={{ fill: '#059669', r: 4 }}
                      activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={dashboardData.labels.map((label, index) => ({
                    name: label,
                    revenue: dashboardData.revenueData[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#666' }}
                      interval={filter === 'monthly' ? 2 : 0}
                      angle={filter === 'monthly' ? -45 : 0}
                      textAnchor={filter === 'monthly' ? 'end' : 'middle'}
                      height={filter === 'monthly' ? 60 : 30}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#666' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                      labelFormatter={(label) => `Time: ${label}`}
                      cursor={{ fill: 'rgba(5, 150, 105, 0.1)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenue"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
