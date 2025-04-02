import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import DetailsModel from '../Doctor/DetailsModel';
import cookies from 'js-cookie';
import Sidebar from './Sidebar';
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../../Components/Common/Pagination';
import DataTable from '../../Components/Common/DataTable';
import { doctorList, handleAction } from '../../Services/adminService/adminService';
const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBlockDoctor, setSelectedBlockDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
const limit = 10;
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorList(currentPage, limit);
        
        if (response) {
          
          setDoctors(response.doctorsWithIndex);
          setFilteredDoctors(response.doctorsWithIndex);
          setTotalPages(response.totalpage);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to fetch doctors');
      }
    };

    fetchDoctors();
  }, [currentPage]);

  useEffect(() => {
    const result = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.Departmentname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(result);
  }, [searchTerm, doctors]);
  const handleBlockUnblock = async (doctorid) => {
    try {
      
      const response = await handleAction(doctorid);

      const updatedDoctors = doctors.map(doctor => {
        if (doctor._id === doctorid) {
          const newBlockedStatus = !doctor.isBlocked;
          return { ...doctor, isBlocked: newBlockedStatus };
        }
        return doctor;
      });

      setDoctors(updatedDoctors);
      setFilteredDoctors(updatedDoctors);
      setIsConfirmModalOpen(false);
      setSelectedBlockDoctor(null);

      const doctor = doctors.find(d => d._id === doctorid);
      const newStatus = !doctor.isBlocked;
      if (newStatus) {
        toast.error('Doctor has been blocked', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      } else {
        toast.success('Doctor has been unblocked', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      }
    } catch (error) {
      console.error('Block/Unblock error:', error);
      toast.error('Failed to update doctor status', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleBlockConfirmation = (doctor) => {
    setSelectedBlockDoctor(doctor);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedBlockDoctor(null);
  };

  const columns = [
    {
      header: 'S.No',
      accessor: 'serialNumber', 
      width: '80px'
    },
    {
      header: 'Name',
      accessor: 'name'
    },
    {
      header: 'Profile',
      accessor: 'profileImage',
      render: (row) => (
        row.profileImage ? (
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={row.profileImage}
            alt={`${row.name}'s profile`}
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {row.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )
      )
    },
    {
      header: 'Specialization',
      accessor: 'specialization',
      render: (row) => row.specialization?.Departmentname || 'N/A'

    },
    {
      header: 'Details',
      accessor: '_id',
      render: (row) => (
        <button 
          onClick={() => {
            setSelectedDoctor(row);
            setShowModal(true);
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
      )
    },
    {
      header: 'Action',
      accessor: 'isBlocked',
      render: (row) => (
        <button 
          className={`px-3 py-1 text-white text-sm rounded hover:opacity-80 transition-colors ${
            row.isBlocked === true 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`} 
          onClick={() => handleBlockConfirmation(row)}
        >
          {row.isBlocked === true ? 'Unblock' : 'Block'}
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar activePage="/doctors" />
      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 lg:p-6 border-b border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">Doctors Management</h2>
            <div className="relative w-full lg:w-64">
              <input
                type="text"
                placeholder="Search by name or specialization"
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
              emptyMessage="No doctors found"
              headerClassName="bg-gray-50"
              rowClassName="hover:bg-gray-50 transition-colors"
            />
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

     
      <DetailsModel
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        doctor={selectedDoctor}
      />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedBlockDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h2>
              <p className="text-gray-600">
                Are you sure you want to {selectedBlockDoctor.isBlocked ? 'unblock' : 'block'} Dr. {selectedBlockDoctor.name}?
              </p>
              {!selectedBlockDoctor.isBlocked && (
                <p className="text-red-600 mt-2 text-sm">
                  Note: Blocking a doctor will prevent them from accessing the system and accepting new appointments.
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
                onClick={() => handleBlockUnblock(selectedBlockDoctor._id)}
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  selectedBlockDoctor.isBlocked 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {selectedBlockDoctor.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
