import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import {
  FaUsers,
  FaUserMd,
  FaHospital,
  FaWallet,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
  FaSearch,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  // Sample data for demonstration
//   const doctors = [
//     { id: 1, name: 'Dr. John Doe', department: 'Cardiology', date: '2023-10-01' },
//     { id: 2, name: 'Dr. Jane Smith', department: 'Neurology', date: '2023-10-02' },
//     { id: 3, name: 'Dr. Emily Johnson', department: 'Orthopedics', date: '2023-10-03' },
//   ];

    // const fetchDoctors = async ()=>
    // {
    //     useEffect(()=>
    //     {
    //         const response = await axios.get('http://localhost:5000/api/admin/doctors');
    //     },[])
    // }

    useEffect(()=>
    {
        const fetchDoctors = async ()=>
        {
            try{
                const response = await axios.get('http://localhost:5000/api/admin/doctors');
                setDoctors(response.data);
                console.log("api responsedoctordssss",response.data);
            }
            catch(error)
            {
                console.log(error)
            }
        }
        fetchDoctors()
    })



  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a2b4b] text-white h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-blue-400">HealthHive</h2>
        </div>
        <nav className="mt-6 px-4">
          <button 
            onClick={() => navigate('/admin-dashboard')}
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
            className="flex items-center w-full px-4 py-3 text-left bg-blue-800 text-white rounded-lg transition-all mb-2"
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
      <div className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Doctors Management</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                      
                      
                      
                      {doctor.profileImage ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.profileImage}
                              alt={`${doctor.name}'s profile`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {doctor.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                      
                      
                      
                      
                      
                      
                      
                      {/* {doctor.profileImage} */}
                      
                      
                      
                      
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                        Block
                      </button>
                      <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
                        Unblock
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">1</span> of <span className="font-medium">3</span>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
