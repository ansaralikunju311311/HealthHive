import React from 'react';
import Bannerdoctor from '../assets/Bannerdoctor.png'
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const BASE_URL = import.meta.env.VITE_API_URL
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const userType = location.state?.userType || 'user';

  const themeConfig = {
    user: {
      background: "bg-gradient-to-br from-blue-50 to-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
      heading: "text-blue-900",
      textColor: "text-gray-600"
    },
    doctor: {
      background: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
      button: "bg-purple-600 hover:bg-purple-700",
      heading: "text-white",
      textColor: "text-gray-300"
    },
  };

  const theme = themeConfig[userType] || themeConfig.user;

  const onSubmit = async (data) => {
    try {
      const endpointMap = {
        'user': `${BASE_URL}/user/reset-password`,
        'doctor': `${BASE_URL}/doctor/reset-password`,
      };

      const endpoint = endpointMap[userType] || endpointMap.user;

      const response = await axios.post(endpoint, { 
        email, 
        otp: data.otp, 
        new_password: data.newPassword 
      });

      toast.success('Password reset successfully!');
      const loginRoutes = {
        'user': '/login',
        'doctor': '/doctor/login',
      };

      navigate(loginRoutes[userType] || '/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      console.error(error);
    }
  };

  return (
    <div className={`min-h-screen ${theme.background} flex flex-col lg:flex-row`}>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className={`text-3xl sm:text-4xl font-bold ${theme.heading} mb-2`}>
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Reset Password
            </h2>
            <p className={`${theme.textColor}`}>Enter your OTP and new password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={`mt-6 sm:mt-8 space-y-4 sm:space-y-6 bg-white/10 backdrop-blur-lg p-4 sm:p-8 rounded-2xl shadow-2xl`}>
            <div className="space-y-5">
              <div>
                <label htmlFor="otp" className={`block text-sm font-medium ${theme.textColor} mb-1`}>
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 ${theme.button.replace('bg-', 'focus:ring-')}`}
                  {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
                />
                {errors.otp && <p className="mt-1 text-sm text-red-500">Please enter a valid 6-digit OTP</p>}
              </div>

              <div>
                <label htmlFor="newPassword" className={`block text-sm font-medium ${theme.textColor} mb-1`}>
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 ${theme.button.replace('bg-', 'focus:ring-')}`}
                  {...register('newPassword', { required: true, minLength: 6 })}
                />
                {errors.newPassword && <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme.textColor} mb-1`}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className={`appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 ${theme.button.replace('bg-', 'focus:ring-')}`}
                  {...register('confirmPassword', {
                    required: true,
                    validate: (value) => value === getValues("newPassword")
                  })}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">Passwords do not match</p>}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white ${theme.button} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 h-screen overflow-hidden">
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
