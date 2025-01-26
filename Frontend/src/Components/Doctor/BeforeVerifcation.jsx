import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
const BeforeVerification = () => {
  const location = useLocation();
  const doctorEmail = location.state?.email;
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('checking');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        if (!doctorEmail) {
          setVerificationStatus('error');
          setMessage('Please login again');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/doctor/get-doctor?email=${doctorEmail}`);
        console.log('Verification response:', response.data);

        if (response.data.isVerified) {
          setVerificationStatus('verified');
          setMessage('Your account has been verified!');
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/doctor-login');
          }, 2000);
        } else {
          setVerificationStatus('pending');
          setMessage(response.data.message || 'Your account is pending verification');
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred');
      }
    };

    checkVerificationStatus();
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
