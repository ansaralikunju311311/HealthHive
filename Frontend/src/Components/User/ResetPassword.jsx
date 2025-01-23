import React from 'react';
import Bannerdoctor from '../../assets/Bannerdoctor.png';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/reset-password',
        { email, otp: data.otp, new_password: data.newPassword });
      console.log(data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter your OTP and new password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <div className="space-y-5">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Code
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
                  />
                </div>
                {errors.otp && <p className="mt-1 text-sm text-red-500">Please enter a valid 6-digit OTP</p>}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('newPassword', { required: true, minLength: 6 })}
                  />
                </div>
                {errors.newPassword && <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('confirmPassword', {
                      required: true,
                      validate: (value) => value === getValues("newPassword")
                    })}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">Passwords do not match</p>}
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          className="object-cover w-full h-full"
          src={Bannerdoctor}
          alt="Healthcare Banner"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
