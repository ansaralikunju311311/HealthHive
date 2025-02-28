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
  // const dispatch = useDispatch();
  // const {isBlocked} = useSelector((state) => state.doctor);
  useEffect(() => {
    
    const fetchDoctors = async () => {
      try {
        const token = cookies.get('admintoken');
        console.log("this is the token", token);
        if(!token) {
          navigate('/admin');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/admin/doctors', {
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
        setTotalPages(response.data.totalpage);
        setFilteredDoctors(response.data.doctorsWithIndex);
        console.log("api response", response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, [currentPage]);


  useEffect(() => {
    const result = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(result);
  }, [searchTerm, doctors]);
  const handleBlockUnblock = async (doctorid) => {
    try {
      const token = cookies.get('admintoken');
      if(!token) {
        navigate('/admin');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/admin/blockdoctor/${doctorid}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true 
      });

      // Find the doctor and toggle their blocked status
      const updatedDoctors = doctors.map(doctor => {
        if (doctor._id === doctorid) {
          const newBlockedStatus = !doctor.isBlocked;
          return { ...doctor, isBlocked: newBlockedStatus };
        }
        return doctor;
      });

      // Update both doctors and filtered doctors
      setDoctors(updatedDoctors);
      setFilteredDoctors(updatedDoctors);
      setIsConfirmModalOpen(false);
      setSelectedBlockDoctor(null);

      // Show appropriate toast message
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/doctors" />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with Search */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Doctors Management</h2>
            <div className="relative w-64">
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialization}</div>
                    </td>
                   
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                     
                    
                    
                      <button 
                        className={`px-3 py-1 text-white text-sm rounded hover:opacity-80 transition-colors ${
                          doctor.isBlocked === true 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`} 
                        onClick={() => handleBlockConfirmation(doctor)}
                      >
                        {doctor.isBlocked === true ? 'Unblock' : 'Block'}
                      </button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>

      {/* Details Modal */}
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
