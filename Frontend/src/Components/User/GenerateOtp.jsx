import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { setUser, setToken } from '../../Components/redux/Features/userSlice';
import  cookies  from 'js-cookie';
const GenerateOtp = () => {
  // const dispatch = useDispatch();
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
      // console.log("verify otp response:", response.data);
      
      // Dispatch both user and token to Redux
      // dispatch(setUser(response.data.user));
      // localStorage.setItem('useraccessToken',response.data.userToken);
      // setToken(response.data.userToken);

      // console.log("this token   generator token:",response.data.userToken);
      // console.log("this token:",dispatch(setToken(response.data.userToken)));

      if(response.data.userToken){
        console.log('otp generate going to protected route warp')
        // console.log("this token   comen rthidfhbilhdsbfhlabhr:",response.data.userToken);
        cookies.set('useraccessToken', response.data.userToken);
          navigate('/home');
      
      // navigate('/home');
      // console.log("this token   hcbcbhjvbhjbhdbhdbhfbhbfhcomen rthidfhbilhdsbfhlabhr:",response.data.userToken);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (remainingTime > 0) {
      setError('Please wait before requesting a new OTP');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      console.log('Resending OTP for email:', email);
      const response = await axios.post('http://localhost:5000/api/user/resend-otp', {
        email
      });
      
      setSuccess('New verification code sent to your email');
      console.log('Resend OTP response:', response.data);
      
      // Fetch the new remaining time
      const timeResponse = await axios.get(`http://localhost:5000/api/user/otp-remaining-time?email=${email}`);
      setRemainingTime(timeResponse.data.remainingTime);
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError(error.response?.data?.message || 'Error sending verification code');
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
