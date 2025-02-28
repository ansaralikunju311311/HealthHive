import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../../Components/Common/Pagination';

const Department = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/department', {
          params:{
            page:currentPage,
            limit:10
          },
          withCredentials: true,
        });
        console.log(response.data);
        setDepartments(response.data.departments);
        setTotalPages(response.data.totalpage);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, [currentPage]);

  // Filter departments based on search term and status
  const filteredDepartments = departments.filter(dept => {
    if (!dept || !dept.Departmentname) return false;
    const nameMatch = dept.Departmentname.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || dept.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const handleListing = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/department/${id}`, {}, {
        withCredentials: true,
      });
      
      // Fetch updated departments for the current page
      const updatedResponse = await axios.get('http://localhost:5000/api/admin/department', {
        params: {
          page: currentPage,
          limit: 10
        },
        withCredentials: true,
      });

      setDepartments(updatedResponse.data.departments);
      setTotalPages(updatedResponse.data.totalpage);
      setIsConfirmModalOpen(false);
      setSelectedDepartment(null);

      toast.success('Department status updated successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update department status');
    }
  };

  const handleListingConfirmation = (dept) => {
    setSelectedDepartment(dept);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleAddDepartment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDepartmentName('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim the department name and check if it's empty
    const trimmedDepartmentName = departmentName.trim();
    if (!trimmedDepartmentName) {
      toast.error('Department name cannot be empty');
      return;
    }

    // Check if department name contains only spaces
    if (trimmedDepartmentName.length < 3) {
      toast.error('Department name must be at least 3 characters long');
      return;
    }

    // Check if department already exists
    const departmentExists = departments.some(
      dept => dept.Departmentname.toLowerCase() === trimmedDepartmentName.toLowerCase()
    );
    if (departmentExists) {
      toast.error('Department already exists');
      return;
    }

    try {
      console.log("Adding department:", trimmedDepartmentName);
      const response = await axios.post('http://localhost:5000/api/admin/department', {
        Departmentname: trimmedDepartmentName,
        Description: description
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch updated departments for the current page
      const updatedResponse = await axios.get('http://localhost:5000/api/admin/department', {
        params: {
          page: currentPage,
          limit: 10
        },
        withCredentials: true,
      });
      
      setDepartments(updatedResponse.data.departments);
      setTotalPages(updatedResponse.data.totalpage);
      
      console.log("Response from backend:", response.data);
      toast.success('Department added successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error(error.response?.data?.message || 'Failed to add department');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/departments" />
      <div className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header with Search and Add Department */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search by Department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Listed">Listed</option>
                <option value="Unlisted">Unlisted</option>
              </select>
            </div>
            <button 
              onClick={handleAddDepartment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Department
            </button>
          </div>

          {/* Department Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Sl NO</th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">DEPARTMENT</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">STATUS</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map((dept, index) => (

                  <tr key={index} className="hover:bg-gray-50">

<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.serialNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{dept.Departmentname}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dept.status === 'Listed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`px-4 py-1 rounded-lg text-sm font-medium ${
                          dept.status === 'Listed' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                        } transition-colors`}
                        onClick={() => handleListingConfirmation(dept)}
                      >
                        {dept.status === 'Listed' ? 'Unlist' : 'List'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Replace the existing pagination with the Pagination component */}
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add Department</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  id="departmentName"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department name"
                  required
                />

                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h2>
              <p className="text-gray-600">
                Are you sure you want to {selectedDepartment.status === 'Listed' ? 'unlist' : 'list'} the department "{selectedDepartment.Departmentname}"?
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
                onClick={() => handleListing(selectedDepartment._id)}
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  selectedDepartment.status === 'Listed' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedDepartment.status === 'Listed' ? 'Unlist' : 'List'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;