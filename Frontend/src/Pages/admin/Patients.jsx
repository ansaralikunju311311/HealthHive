import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import Sidebar from './Sidebar';
import PatientDetailsModal from './PatientDetailsModal';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBlockPatient, setSelectedBlockPatient] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // const token = localStorage.getItem('admintoken');
        const token = cookies.get('admintoken');
        console.log("this is the token", token);
        if(!token) {
          navigate('/admin');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/admin/patients', {
          params:{
            page:currentPage,
            limit:10
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

  // Search functionality
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
        const token = cookies.get('admintoken');
        if (!token) {
            toast.error('Please login to continue', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored"
            });
            navigate('/admin');
            return;
        }
        const response = await axios.put(`http://localhost:5000/api/admin/unblockpatient/${patientid}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });
        console.log("api response", response.data);

        // Find the patient and toggle their blocked status
        const updatedPatients = patients.map(patient => {
            if (patient._id === patientid) {
                const newBlockedStatus = !patient.isBlocked;
                return { ...patient, isBlocked: newBlockedStatus };
            }
            return patient;
        });

        // Update both patients and filtered patients lists
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setIsConfirmModalOpen(false);
        setSelectedBlockPatient(null);

        // Show appropriate toast message based on new status
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/patients" />

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
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.image ? (
                        <img
                          src={patient.image}
                          alt={`${patient.name}'s profile`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {patient.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                        className={`px-3 py-1 text-white text-sm rounded hover:opacity-80 transition-colors ${
                          patient.isBlocked === true 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`} 
                        onClick={() => handleBlockConfirmation(patient)}
                      >
                        {patient.isBlocked === true ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={()=>setCurrentPage(currentPage-1)}
            disabled={currentPage===1}>
              Previous
            </button>
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={()=>setCurrentPage(currentPage+1)}
            disabled={currentPage===totalPages}>
              Next
            </button>
        
          </div>



        </div>
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        patient={selectedPatient}
      />

      {/* Confirmation Modal */}
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
