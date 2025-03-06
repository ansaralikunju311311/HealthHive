import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp, getOtpRemainingTime } from '../../Services/apiService';
import { toast } from 'react-toastify';

const GenerateOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }
    const fetchRemainingTime = async () => {
      try {
        const response = await getOtpRemainingTime(email);
        setRemainingTime(response.remainingTime);
      } catch (error) {
        console.error('Error fetching remaining time:', error);
        setRemainingTime(0);
      }
    };
    fetchRemainingTime();
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [remainingTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      toast.info('Verifying your email...');
      const response = await verifyOtp(email, otp);
      setSuccess(response.message);
      
      if (response) {
        toast.success('Email verified successfully! Welcome to HealthHive.');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (remainingTime > 0) {
      toast.warning(`Please wait ${remainingTime} seconds before requesting a new code.`);
      return;
    }
    
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      toast.info('Sending new verification code...');
      await ResendOtp(email);
      toast.success('New verification code sent to your email.');
      
      const timeResponse = await getOtpRemainingTime(email);
      setRemainingTime(timeResponse.remainingTime);
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the verification code sent to {email}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={remainingTime > 0 || isLoading}
              className={`text-sm font-medium ${
                remainingTime > 0 ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-500'
              }`}
            >
              {remainingTime > 0
                ? `Resend code in ${remainingTime}s`
                : 'Resend verification code'}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateOtp;
