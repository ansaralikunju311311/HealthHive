import React from 'react';

const DetailsModel = ({ isOpen, onClose, doctor }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Doctor Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                <img
                  src={doctor.profileImage}
                  alt={`${doctor.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">{doctor.name}</h3>
                <p className="text-xl text-blue-600 font-semibold mt-1">{doctor.specialization}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="bg-blue-50 px-6 py-3 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium">Experience</p>
                  <p className="text-lg font-bold text-blue-700">{doctor.yearsOfExperience} Years</p>
                </div>
                <div className="bg-purple-50 px-6 py-3 rounded-xl">
                  <p className="text-sm text-gray-600 font-medium">Consultation Fee</p>
                  <p className="text-lg font-bold text-purple-700">₹{doctor.consultFee}</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About Doctor
            </h4>
            <p className="text-gray-700 leading-relaxed text-lg">{doctor.about}</p>
          </div>

          {/* Contact and Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium mt-1">{doctor.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-800 font-medium mt-1">{doctor.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Personal Information
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-800 font-medium mt-1 capitalize">{doctor.gender}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm font-medium text-gray-500">Specialization</p>
                  <p className="text-gray-800 font-medium mt-1">{doctor.specialization}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Verification Documents
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medical License */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h5 className="font-semibold text-gray-800">Medical License</h5>
                  <a 
                    href={doctor.medicalLicense} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <span>View Document</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="p-4">
                  <img
                    src={doctor.medicalLicense}
                    alt="Medical License"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* ID Proof */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h5 className="font-semibold text-gray-800">ID Proof</h5>
                  <a 
                    href={doctor.idProof} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <span>View Document</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="p-4">
                  <img
                    src={doctor.idProof}
                    alt="ID Proof"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModel;
