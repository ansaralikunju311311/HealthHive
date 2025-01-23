import React, { useEffect, useState } from 'react';
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

const DoctorVerification = () => {

  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(()=>{
    const fetchDoctors = async ()=>{
      try {
        const response = await axios.get('http://localhost:5000/api/admin/pending-doctors');
        setDoctors(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDoctors();
  },[])
  useEffect(()=>{
    const result = doctors.filter((doctor)=>doctor.name.toLowerCase().includes(searchTerm.toLowerCase())||doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    // setDoctors(result);
    setFilteredDoctors(result);

  },[searchTerm,doctors])
  const navigate = useNavigate();

  // Sample data for UI demonstration
  // const doctors = [
  //   { name: "Dr. John Doe", department: "Cardiology", date: "2023-10-01" },
  //   { name: "Dr. Jane Smith", department: "Neurology", date: "2023-10-02" },
  //   { name: "Dr. Emily Johnson", department: "Orthopedics", date: "2023-10-03" }
  // ];

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
            className="flex items-center w-full px-4 py-3 text-left bg-blue-800 text-white rounded-lg transition-all mb-2"
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
      <div className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Doctor Verification</h1>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search by name or department"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
             value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Table Header */}
          <div className="w-full">
            <div className="grid grid-cols-6 bg-gray-100 p-4 rounded-t-lg font-medium text-gray-600">
              <div>NAME</div>
              <div>PROFILE IMAGE</div>
              <div>SPECIALIZATION</div>
              <div>STATUS</div>
             
              <div>DETAILS</div>
              <div>ACTION</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor, index) => (
                <div key={index} className="grid grid-cols-6 p-4 hover:bg-gray-50">
                  <div className="text-gray-900">{doctor.name}</div>
                  <div className="flex items-center justify-center">
                    <img
                      src={doctor.profileImage}
                      alt={`${doctor.name}'s profile`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="text-gray-900">{doctor.specialization}</div>
                  <div>
                    <span className="px-2 py-1 text-yellow-600 bg-yellow-100 rounded-full text-sm">
                      Pending
                    </span>
                  </div>
                 
                  <div>
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Rejected
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-4">
            <button
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <div className="text-gray-600">
              Page 1 of 3
            </div>
            <button
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;
