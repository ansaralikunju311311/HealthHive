import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const Patients = () => {

const [patients, setPatients] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [filteredPatients, setFilteredPatients] = useState([]);

useEffect(() => {
  const fetchPatients = async ()=> {
      try {
          const response = await axios.get('http://localhost:5000/api/admin/patients');
          setPatients(response.data);
          setFilteredPatients(response.data);
          console.log(response.data);
      } catch (error) {
          console.log(error);
      }
  }
  fetchPatients();
}, [])

// Search functionality
useEffect(() => {
  const results = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.serialNumber?.toString().includes(searchTerm) ||
    patient.gender?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredPatients(results);
}, [searchTerm, patients]);

const viewDetails = (patient) => {
  navigate(`/patient-details/${patient._id}`);
}
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
            className="flex items-center w-full px-4 py-3 text-left bg-blue-800 text-white rounded-lg transition-all mb-2"
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
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-8">Patient Management</h1>
          
          {/* Search Bar */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by Patient Name or Serial Number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Patient Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient,index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {patient.image ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={patient.image}
                              alt={`${patient.name}'s profile`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {patient.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => viewDetails(patient)}>
                        View Details
                      </button>
                      <button className="text-red-600 hover:text-red-900 mr-3">
                        Block
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 bg-white px-4 py-3 rounded-lg">
            <button className="flex items-center px-3 py-1 rounded text-gray-600 hover:text-blue-600">
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <span className="text-gray-600">Page 1 of 3</span>
            <button className="flex items-center px-3 py-1 rounded text-gray-600 hover:text-blue-600">
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
