import React from 'react';

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 lg:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="flex flex-col lg:flex-row items-start lg:items-center mb-6 gap-4">
          <div className="w-full lg:w-auto">
            {patient.image ? (
              <img
                src={patient.image}
                alt={`${patient.name}'s profile`}
                className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-100">
                <span className="text-blue-500 text-2xl font-semibold">
                  {patient.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="w-full lg:w-auto">
            <h2 className="text-xl lg:text-2xl font-bold">{patient.name}</h2>
            <p className="text-gray-600">Patient ID: {patient.serialNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
              <p className="text-gray-900">{patient.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">Phone</label>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">Gender</label>
              <p className="text-gray-900">{patient.gender}</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">Age</label>
              <p className="text-gray-900">{patient.age}</p>
            </div>
          
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">Status</label>
              <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                {patient.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
