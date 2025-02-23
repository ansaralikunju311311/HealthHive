import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MdDashboard, 
  MdEventAvailable,
  MdSchedule,
  MdChat,
  MdAccountBalanceWallet,
  MdExitToApp 
} from 'react-icons/md';
import { toast } from 'react-toastify';

const DoctorDash = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isBlocked } = useSelector((state) => state.doctor);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = cookies.get('doctortoken');
        if (!token) {
          navigate('/doctor/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/doctor/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true,
        });
    
        setDoctor(response.data.doctor);
        console.log(response.data.doctor);
        setLoading(false);
        if(response.data.doctor.isBlocked===true && response.data.doctor.isActive===true){
          dispatch(isBlocked(true));
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

  // const handleLogout = async() => {

  //   cookies.remove('doctortoken');
  //   toast.info('You have been logged out', {
  //     icon: '👋'
  //   });
  //   navigate('/doctor/login');
  // };


  const handleLogout =  async() => {
    try {
      
     await axios.post('http://localhost:5000/api/doctor/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });
    const token = cookies.remove('doctortoken', { path: '/' });
    // console.log('logged out====', token)
      setDoctor(null);
      navigate('/doctor/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error
      cookies.remove('doctortoken', { path: '/' });
      navigate('/doctor/login');
    }
  };




  const profileClick = (id) => {
    console.log(id);
    navigate(`/profile`,{state:{userId:id}});
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  const dummyAppointments = [
    { id: 1, patientName: 'John Doe', date: '2023-10-10', time: '10:00 AM', status: 'Pending' },
    { id: 2, patientName: 'Jane Smith', date: '2023-10-11', time: '11:00 AM', status: 'Confirmed' },
    { id: 3, patientName: 'Emily Johnson', date: '2023-10-12', time: '12:00 PM', status: 'Cancelled' },
  ];

  const sidebarItems = [
    { icon: <MdDashboard className="w-6 h-6" />, text: 'Dashboard', active: true },
    { icon: <MdEventAvailable className="w-6 h-6" />, text: 'Appointments' },
    { icon: <MdSchedule className="w-6 h-6" />, text: 'Current Schedules' },
    { icon: <MdChat className="w-6 h-6" />, text: 'Chats' },
    { icon: <MdAccountBalanceWallet className="w-6 h-6" />, text: 'Wallet' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 space-y-4">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-semibold">Welcome, Dr. {doctor?.name}</div>
          <div className="flex items-center space-x-4">
            {doctor?.profileImage && (
              <img
                src={doctor.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
                onClick={() => profileClick(doctor._id)}
              />
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-800">120</p>
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Patients</p>
              <p className="text-2xl font-bold text-gray-800">85</p>
            </div>
          </div>

          {/* Payment Due */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment Due</p>
              <p className="text-2xl font-bold text-gray-800">$1,500</p>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;
