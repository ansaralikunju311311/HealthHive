import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

const Department = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');

  // Sample department data
  // const departments = [
  //   { name: 'Cardiology', status: 'Listed', action: 'Unlist' },
  //   { name: 'Neurology', status: 'Listed', action: 'Unlist' },
  //   { name: 'Orthopedics', status: 'Unlisted', action: 'List' },
  //   { name: 'Pediatrics', status: 'Listed', action: 'Unlist' },
  //   { name: 'Dermatology', status: 'Unlisted', action: 'List' },
  // ];


  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/department', {
          withCredentials: true,
        });
        console.log(response.data);
        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, []);



  const handleListing = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/department/${id}`, {
      }, {
        withCredentials: true,
      });
      toast.success('Department status updated successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update department status');
    }
  };

  const handleAddDepartment = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDepartmentName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Adding department:", departmentName);
      const response = await axios.post('http://localhost:5000/api/admin/department', {
        Departmentname: departmentName
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
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
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search by Department"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">DEPARTMENT</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">STATUS</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{dept.Departmentname}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dept.status === 'Listed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      <button
                        className={`px-4 py-1 rounded-lg text-sm font-medium ${
                          dept.action === 'List' 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        } transition-colors`}
                      >
                        {dept.action}
                      </button>
                    </td> */}
                    <td>
                      <button
                        className={`px-4 py-1 rounded-lg text-sm font-medium ${
                          dept.status === 'Listed' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                        } transition-colors`}
                       onClick={()=>handleListing(dept._id)}  >
                        {dept.status === 'Listed' ? 'Unlist' : 'List'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page 1 of 3
            </div>
            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
    </div>
  );
};

export default Department;