import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Sidebar from './Sidebar';
import PatientDetailsModal from './PatientDetailsModal';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Pagination from '../../Components/Common/Pagination';
import DataTable from '../../Components/Common/DataTable';
import { patientAction } from '../../Services/apiService';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBlockPatient, setSelectedBlockPatient] = useState(null);
const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = cookies.get('admintoken');
        console.log("this is the token", token);
        if(!token) {
          navigate('/admin');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/admin/patients', {
          params:{
            page:currentPage,
            limit,
          },
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true,
        });
        setPatients(response.data.patientsWithIndex);
        setTotalPages(response.data.totalpage);
        setFilteredPatients(response.data.patientsWithIndex);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPatients();
  }, [currentPage])

  useEffect(() => {
    const results = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.serialNumber?.toString().includes(searchTerm) ||
      patient.gender?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const handleBlockUnblock = async (patientid) => {
    try {
       
        const response = await patientAction(patientid);

        const updatedPatients = patients.map(patient => {
            if (patient._id === patientid) {
                const newBlockedStatus = !patient.isBlocked;
                return { ...patient, isBlocked: newBlockedStatus };
            }
            return patient;
        });

        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setIsConfirmModalOpen(false);
        setSelectedBlockPatient(null);

        const patient = patients.find(p => p._id === patientid);
        const newStatus = !patient.isBlocked;
        if (newStatus) {
            toast.error('Patient has been blocked', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored"
            });
        } else {
            toast.success('Patient has been unblocked', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored"
            });
        }
    } catch (error) {
        console.error('Block/Unblock error:', error.response?.data?.message);
        toast.error(error.response?.data?.message || 'Failed to update patient status', {
            position: "top-right",
            autoClose: 3000
        });
    }
  };

  const handleBlockConfirmation = (patient) => {
    setSelectedBlockPatient(patient);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedBlockPatient(null);
  };

  const navigate = useNavigate();

  const columns = [
    {
      header: 'Patient ID',
      accessor: 'serialNumber',
      width: '100px'
    },
    {
      header: 'Profile',
      accessor: 'image',
      render: (row) => (
        row.image ? (
          <img
            src={row.image}
            alt={`${row.name}'s profile`}
            className="h-10 w-10 rounded-full object-cover"
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
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Age',
      accessor: 'age'
    },
    {
      header: 'Gender',
      accessor: 'gender'
    },
    {
      header: 'Details',
      accessor: '_id',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedPatient(row);
            setShowModal(true);
          }}
          className="text-blue-600 hover:text-blue-900"
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
  const startSerial = (currentPage - 1) * limit + 1;
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/patients" />
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-8">Patient Management</h1>

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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <DataTable 
              columns={columns}
              data={filteredPatients.map((patient, index) => ({
                ...patient,
                serialNumber: startSerial + index
              }))}
              emptyMessage="No patients found"
              headerClassName="bg-gray-50"
              rowClassName="hover:bg-gray-50 transition-colors"
            />
          </div>

          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <PatientDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        patient={selectedPatient}
      />

      {isConfirmModalOpen && selectedBlockPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h2>
              <p className="text-gray-600">
                Are you sure you want to {selectedBlockPatient.isBlocked ? 'unblock' : 'block'} the patient "{selectedBlockPatient.name}"?
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBlockUnblock(selectedBlockPatient._id)}
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  selectedBlockPatient.isBlocked 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {selectedBlockPatient.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
