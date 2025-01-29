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
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials:true,
        });
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
   const handleBlock = async (patientid) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/admin/blockpatient/${patientid}`);
        toast.error('Patient has been blocked', {
            position: "top-right",
            autoClose: 3000,
            theme: "colored"
        });
        setPatients(patients.map(patient => 
            patient._id === patientid ? {...patient, isBlocked: true} : patient
        ));
    } catch (error) {
        toast.error('Failed to block patient', {
            position: "top-right",
            autoClose: 3000
        });
    }
}

const handleUnblock = async (patientid) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/admin/unblockpatient/${patientid}`);
        toast.success('Patient has been unblocked', {
            position: "top-right",
            autoClose: 3000,
            theme: "colored"
        });
        setPatients(patients.map(patient => 
            patient._id === patientid ? {...patient, isBlocked: false} : patient
        ));
    } catch (error) {
        toast.error('Failed to unblock patient', {
            position: "top-right",
            autoClose: 3000
        });
    }
}
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
                        onClick={patient.isBlocked === true 
                          ? () => handleUnblock(patient._id) 
                          : () => handleBlock(patient._id)}
                      >
                        {patient.isBlocked === true ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default Patients;
