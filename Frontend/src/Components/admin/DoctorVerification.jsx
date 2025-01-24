import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
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
import DetailsModel from '../Doctor/DetailsModel';

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    const fetchDoctors = async ()=>{
      try {
        const response = await axios.get('http://localhost:5000/api/admin/pending-doctors');
        setDoctors(response.data);
        console.log("api response",response.data);
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


  const handleApprove = async(doctorid)=>
  {
    console.log("=======",doctorid);
     const response = await axios.put(`http://localhost:5000/api/admin/approve-doctor/${doctorid}`);
     console.log(response.data);
  }
  const handleReject = async(doctorid)=>
  {
    console.log("=======",doctorid);
     const response = await axios.put(`http://localhost:5000/api/admin/reject-doctor/${doctorid}`);
     console.log(response.data);
  }
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/doctor-verification" />
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
                      onClick={() => {
                        console.log("in model details ====", doctor);
                        setSelectedDoctor(doctor);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      onClick={() => handleApprove(doctor._id)} >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={handleReject(doctor._id)}
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

      {/* Details Modal */}
      <DetailsModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default DoctorVerification;
