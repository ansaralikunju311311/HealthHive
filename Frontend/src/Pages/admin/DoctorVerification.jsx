import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import cookies from 'js-cookie';
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
import { toast } from 'react-toastify';

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchDoctors = async () => {
    try {
      const token = cookies.get('admintoken');
      if(!token) {
        navigate('/admin');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/admin/pending-doctors',{
        params:{
          page:currentPage,
          limit:10
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setDoctors(response.data.doctorsWithIndex);
      setFilteredDoctors(response.data.doctorsWithIndex);
      setTotalPages(response.data.totalpage);
      console.log("api response", response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [currentPage]);

  useEffect(() => {
    const result = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(result);
  }, [searchTerm, doctors]);

  const handleApprove = async (doctorid) => {
    try {
      const token = cookies.get('admintoken');
      if(!token) {
        navigate('/admin');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/admin/approve-doctor/${doctorid}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      if (response.data.doctor) {
        toast.success('Doctor approved successfully', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
        // Remove the approved doctor from both states
        const updatedDoctors = doctors.filter(doctor => doctor._id !== doctorid);
        setDoctors(updatedDoctors);
        setFilteredDoctors(prevFiltered => prevFiltered.filter(doctor => doctor._id !== doctorid));
      }
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error('Failed to approve doctor', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
    }
  };

  const handleReject = async (doctorid) => {
    try {
      const token = cookies.get('admintoken');
      if(!token) {
        navigate('/admin');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/admin/reject-doctor/${doctorid}`,{},{
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      toast.error('Doctor application rejected', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      // Remove the rejected doctor from both states
      const updatedDoctors = doctors.filter(doctor => doctor._id !== doctorid);
      setDoctors(updatedDoctors);
      setFilteredDoctors(prevFiltered => prevFiltered.filter(doctor => doctor._id !== doctorid));
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error('Failed to reject doctor', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
    }
  };

  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/doctor/verification" />
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-7 bg-gray-100 p-4 rounded-t-lg font-medium text-gray-600">
              <div>SL. NO</div>
              <div>NAME</div>
              <div>PROFILE IMAGE</div>
              <div>SPECIALIZATION</div>
              <div>STATUS</div>
              <div>DETAILS</div>
              <div>ACTION</div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredDoctors.map((doctor, index) => (
                <div key={doctor._id} className="grid grid-cols-7 p-4 hover:bg-gray-50">
                 <div className='text-gray-900'>{doctor.serialNumber}</div>
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
                        setSelectedDoctor(doctor);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="px-6 py-4 text-sm font-medium text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleApprove(doctor._id)}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(doctor._id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 px-4">
            <button className="flex items-center text-gray-600 hover:text-blue-600"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <div className="text-gray-600">Page {currentPage} of {totalPages}</div>
            <button className="flex items-center text-gray-600 hover:text-blue-600"
            onClick={()=>setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      <DetailsModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default DoctorVerification;
