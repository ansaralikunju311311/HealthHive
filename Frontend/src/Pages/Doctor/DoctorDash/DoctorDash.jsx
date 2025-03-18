import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from '../../../Services/doctorService/doctorService';
import { toast } from 'react-toastify';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { appoimentDetails, verifyDoctorToken } from '../../../Services/doctorService/doctorService';

const DoctorDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isBlocked } = useSelector((state) => state.doctor);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [appoiment, setAppoiment] = useState(null);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const reponse = await verifyDoctorToken();
        const doctors = reponse?.doctor;
        setDoctor(doctors);
        
        const responses = await appoimentDetails(doctors._id);
        setAppoiment(responses);
        localStorage.setItem('doctorId', JSON.stringify(doctors));
         
        setLoading(false);
        if(doctors.isBlocked === true && doctors.isActive === true){
          cookies.remove('doctortoken');
          toast.error('Your account has been blocked', {
            icon: '⛔',
            backgroundColor: '#ef4444'
          });
          navigate('/doctor/login');
        }
      } catch (error) {
        console.log(error);
        cookies.remove('doctortoken');
        toast.error('Session expired. Please login again');
        navigate('/doctor/login');
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    if (!doctor?._id) return;
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(doctor._id, filter);
        setDashboardData(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboardData();
  }, [filter, doctor]);

  const handlefilter = (e) => {
    const selectedFilter = e.target.value;
    switch(selectedFilter) {
      case '1':
        setFilter('today');
        break;
      case '2':
        setFilter('weekly');
        break;
      case '3':
        setFilter('monthly');
        break;
      case '4':
        setFilter('yearly');
        break;
      default:
        setFilter('today');
    }
  };

  // const profileClick = (id) => {
  //   console.log(id);
  //   navigate(`/profile`,{state:{userId:id}});
  // };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar doctorid={doctor._id} />
      <div className="flex-1 p-4 md:p-8 md:ml-64 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            <div className="text-xl md:text-2xl font-semibold mb-4 md:mb-0">Welcome, Dr. {doctor?.name}</div>
            <div className="flex items-center space-x-4">
              {doctor?.profileImage && (
                <img
                  src={doctor.profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  onClick={() => navigate(`/profile`,{state:{userId:doctor._id}})}
                />
              )}
            </div>
          </div>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{appoiment.totalAppointments}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">{appoiment.uniquePatients}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Payment Due</p>
                <p className="text-2xl font-bold text-gray-800">₹{appoiment?.totalAppointments * appoiment?.fee?.consultFee - (appoiment?.totalAppointments * appoiment?.fee?.consultFee)*0.1}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Appointment Trends</h2>
                <select
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handlefilter}
                  value={filter === 'today' ? '1' : filter === 'weekly' ? '2' : filter === 'monthly' ? '3' : '4'}
                >
                  <option value="1">Today</option>
                  <option value="2">Weekly</option>
                  <option value="3">Monthly</option>
                  <option value="4">Yearly</option>
                </select>
              </div>
              {dashboardData?.appointments && (
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {filter === 'today' ? (
                      <LineChart data={dashboardData.appointments.labels.map((label, index) => ({
                        time: label,
                        appointments: dashboardData.appointments.data[index]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="time" 
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
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="appointments" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Appointments"
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={dashboardData.appointments.labels.map((label, index) => ({
                        period: label,
                        appointments: dashboardData.appointments.data[index]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="period" 
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
                        />
                        <Legend />
                        <Bar 
                          dataKey="appointments" 
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          name="Appointments"
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
              {!dashboardData?.appointments && (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="text-gray-500">Loading graph data...</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Earnings Overview</h2>
              </div>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {filter === 'today' ? (
                    <LineChart data={dashboardData?.revenue?.labels.map((label, index) => ({
                      time: label,
                      earnings: dashboardData.revenue.data[index]
                    })) || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fill: '#666' }}
                        interval={2}
                      />
                      <YAxis 
                        tick={{ fill: '#666' }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`₹${value}`, 'Earnings']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#059669" 
                        strokeWidth={2}
                        dot={{ fill: '#059669', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Earnings"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={dashboardData?.revenue?.labels.map((label, index) => ({
                      period: label,
                      earnings: dashboardData.revenue.data[index]
                    })) || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="period" 
                        tick={{ fill: '#666' }}
                        interval={filter === 'monthly' ? 2 : 0}
                        angle={filter === 'monthly' ? -45 : 0}
                        textAnchor={filter === 'monthly' ? 'end' : 'middle'}
                        height={filter === 'monthly' ? 60 : 30}
                      />
                      <YAxis 
                        tick={{ fill: '#666' }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`₹${value}`, 'Earnings']}
                      />
                      <Legend />
                      <Bar 
                        dataKey="earnings" 
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                        name="Earnings"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDash;
