import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { DoctorVerification } from '../../Services/apiService';

const BeforeVerification = () => {
  const location = useLocation();
  const doctorEmail = location.state?.email;
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let intervalId;

    const checkVerificationStatus = async () => {
      try {
        if (!doctorEmail) {
          setVerificationStatus('error');
          setMessage('Please login again');
          return;
        }

        
        const response = await DoctorVerification(doctorEmail);
        console.log('Verification response:', response);

        if (response.isRejected) {
          setVerificationStatus('rejected');
          setMessage('Your registration has been rejected');
          if (intervalId) {
            clearInterval(intervalId);
          }
        } else if (response.isVerified) {
          setVerificationStatus('verified');
          setMessage('Your account has been verified!');
          if (intervalId) {
            clearInterval(intervalId);
          }
          setTimeout(() => {
            navigate('/doctor/login');
          }, 2000);
        } else {
          setVerificationStatus('pending');
          setMessage(response.message || 'Your account is pending verification');
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        setVerificationStatus('error');
        setMessage(error.response?.message || 'An error occurred');
      }
    };

    
    checkVerificationStatus();

    
    intervalId = setInterval(checkVerificationStatus, 5000);

    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [doctorEmail, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'checking':
        return (
          <>
            <FaSpinner className="animate-spin text-6xl text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Checking verification status...</h2>
          </>
        );
      case 'verified':
        return (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Successful!</h2>
            <p className="text-gray-600">Redirecting to login page...</p>
          </>
        );
      case 'pending':
        return (
          <>
            <FaClock className="text-6xl text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Pending</h2>
            <p className="text-gray-600 text-center max-w-md">
              Your account is currently under review. Our team will verify your credentials shortly.
              Please check back later.
            </p>
          </>
        );
      case 'error':
        return (
          <>
            <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600">{message}</p>
          </>
        );
      case 'rejected':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <FaExclamationTriangle className="text-6xl text-red-500" />
              <div className="absolute -top-2 -right-2 bg-red-100 rounded-full p-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Registration Rejected</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 font-medium">
                  Your registration request has been denied by our administrators.
                </p>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p className="font-medium">
                  Please note:
                </p>
                <ul className="space-y-2 text-left list-disc list-inside">
                  <li>Make sure to provide accurate and complete documentation</li>
                  <li>Ensure all credentials are valid and up-to-date</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <p className="text-sm text-blue-800">
                  Need assistance? Contact our support team:
                  <br />
                  <a 
                    href="mailto:admin@healthhive.com" 
                    className="font-bold hover:underline"
                  >
                    admin@healthhive.com
                  </a>
                </p>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/doctor/signup')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Registration
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="flex flex-col items-center text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BeforeVerification;
