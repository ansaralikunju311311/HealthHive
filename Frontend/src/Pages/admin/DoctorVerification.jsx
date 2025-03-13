import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import cookies from 'js-cookie';
import Pagination from '../../Components/Common/Pagination';
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
import DataTable from '../../Components/Common/DataTable';
import { approveDoctor, pendingDoctors, rejectedDoctor } from '../../Services/adminService/adminService';

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedActionDoctor, setSelectedActionDoctor] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
const limit =10;
  const fetchDoctors = async (page) => {
    try {
    
      const response = await pendingDoctors(page, searchTerm,limit);
      
      const { doctorsWithIndex, totalPages } = response;
      
      setDoctors(doctorsWithIndex);
      setFilteredDoctors(doctorsWithIndex);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Error fetching doctors. Please try again.');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors(currentPage);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApprove = async (doctorid) => {
    try {

      const response = await approveDoctor(doctorid)
      if (response.doctor) {
        toast.success('Doctor approved successfully', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      
        const updatedDoctors = doctors.filter(doctor => doctor._id !== doctorid);
        setDoctors(updatedDoctors);
        setFilteredDoctors(prevFiltered => prevFiltered.filter(doctor => doctor._id !== doctorid));
      }
      setIsConfirmModalOpen(false);
      setSelectedActionDoctor(null);
      setActionType(null);
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
      const response = await rejectedDoctor(doctorid)
      toast.error('Doctor application rejected', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      // Remove the rejected doctor from both states
      const updatedDoctors = doctors.filter(doctor => doctor._id !== doctorid);
      setDoctors(updatedDoctors);
      setFilteredDoctors(prevFiltered => prevFiltered.filter(doctor => doctor._id !== doctorid));
      setIsConfirmModalOpen(false);
      setSelectedActionDoctor(null);
      setActionType(null);
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error('Failed to reject doctor', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
    }
  };

  const handleActionConfirmation = (doctor, action) => {
    setSelectedActionDoctor(doctor);
    setActionType(action);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedActionDoctor(null);
    setActionType(null);
  };

  const navigate = useNavigate();
  const columns = [
    {
      header: 'SL. NO',
      accessor: 'serialNumber'
    },
    {
      header: 'NAME',
      accessor: 'name'
    },
    {
      header: 'PROFILE IMAGE',
      accessor: 'profileImage',
      render: (row) => (
        <div className="flex items-center justify-center">
          <img
            src={row.profileImage}
            alt={`${row.name}'s profile`}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
      )
    },
    {
      header: 'SPECIALIZATION',
      accessor: 'specialization',
      render: (row) => row.specialization?.Departmentname || 'N/A'
    },
    {
      header: 'STATUS',
      accessor: 'status',
      render: () => (
        <span className="px-2 py-1 text-yellow-600 bg-yellow-100 rounded-full text-sm">
          Pending
        </span>
      )
    },
    {
      header: 'DETAILS',
      accessor: '_id',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedDoctor(row);
            setShowModal(true);
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          View Details
        </button>
      )
    },
    {
      header: 'ACTION',
      accessor: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => handleActionConfirmation(row, 'approve')}
            className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full transition-colors"
          >
            Approve
          </button>
          <button 
            onClick={() => handleActionConfirmation(row, 'reject')}
            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full transition-colors"
          >
            Reject
          </button>
        </div>
      )
    }
  ];
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar activePage="/doctor/verification" />
      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Doctor Verification</h1>
            <div className="relative w-full lg:w-64">
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
          
          <div className="overflow-x-auto">
            <DataTable 
              columns={columns}
              data={filteredDoctors}
              emptyMessage="No pending doctors found"
              headerClassName="bg-gray-100"
              rowClassName="hover:bg-gray-50 transition-colors"
            />
          </div>
          {filteredDoctors.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <DetailsModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        doctor={selectedDoctor}
      />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedActionDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h2>
              <p className="text-gray-600">
                Are you sure you want to {actionType} Dr. {selectedActionDoctor.name}'s application?
              </p>
              {actionType === 'approve' ? (
                <p className="text-green-600 mt-2 text-sm">
                  This will grant the doctor access to the platform and allow them to start accepting appointments.
                </p>
              ) : (
                <p className="text-red-600 mt-2 text-sm">
                  This will reject the doctor's application and remove them from the pending list.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => actionType === 'approve' 
                  ? handleApprove(selectedActionDoctor._id)
                  : handleReject(selectedActionDoctor._id)
                }
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DoctorVerification;
