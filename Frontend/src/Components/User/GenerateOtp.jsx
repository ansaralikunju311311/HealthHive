import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const GenerateOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  console.log("what is email", email);
  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }
    // Get initial remaining time from backend
    const fetchRemainingTime = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/otp-remaining-time?email=${email}`);
        setRemainingTime(response.data.remainingTime);
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
      console.log('Sending OTP:', otp);
      const response = await axios.post('http://localhost:5000/api/user/verify-otp', {
        email,
        otp: otp.trim() // Ensure no whitespace
      });
      
      setSuccess(response.data.message);
      console.log(response.data.message)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    if (remainingTime > 0) return;
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/user/generate-otp', {
        email
      });
      setSuccess(response.data.message);
      // Fetch the new remaining time
      const timeResponse = await axios.get(`http://localhost:5000/api/user/otp-remaining-time?email=${email}`);
      setRemainingTime(timeResponse.data.remainingTime);
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
          <p className="text-gray-600">
            Please enter the verification code sent to<br />
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-3 rounded-lg text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input
              type="number"
              maxLength="6"
              className="w-48 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="text-center">
              <p className="text-gray-600">
                {remainingTime > 0 && (
                  <span className="block text-sm text-gray-500 mb-2">
                    OTP expires in: {remainingTime} seconds
                  </span>
                )}
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className={`text-blue-600 hover:text-blue-800 font-medium focus:outline-none ${
                    isLoading || remainingTime > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading || remainingTime > 0}
                >
                  {remainingTime > 0 ? `Wait ${remainingTime}s to resend` : 'Resend OTP'}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default GenerateOtp;
