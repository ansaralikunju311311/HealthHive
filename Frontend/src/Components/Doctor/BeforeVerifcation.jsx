import React from 'react';
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const BeforeVerification = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="animate-spin text-blue-600 mb-4">
            <FaSpinner className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Verification in Progress</h2>
          <p className="text-gray-600 text-lg mb-6">
            Your application is currently under review by our administrative team
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-blue-100 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <FaClock className="text-blue-500 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Estimated Time</h3>
            </div>
            <p className="text-gray-600 ml-9">
              The verification process typically takes 24-48 hours to complete
            </p>
          </div>

          <div className="border-2 border-blue-100 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <FaCheckCircle className="text-green-500 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Next Steps</h3>
            </div>
            <ul className="space-y-3 text-gray-600 ml-9">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                You will receive an email notification once verified
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                You can then log in to access your doctor dashboard
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Start accepting appointments and helping patients
              </li>
            </ul>
          </div>

          <div className="border-2 border-yellow-100 rounded-xl p-6 bg-yellow-50">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Important Note</h3>
            </div>
            <p className="text-gray-600 ml-9">
              Please ensure all your submitted documents are valid and up-to-date. This helps speed up the verification process.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@healthhive.com" className="text-blue-600 hover:text-blue-700">
              support@healthhive.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeforeVerification;
