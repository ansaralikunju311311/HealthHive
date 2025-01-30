import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const For = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const getUserType = () => {
    const path = location.pathname;
    if (path === '/doctor/forgotpassword') return 'doctor';
    return 'user';
  };

  // Theme configurations for different user types
  const themeConfig = {
    user: {
      background: "bg-gradient-to-br from-blue-50 to-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
      heading: "text-blue-900"
    },
    doctor: {
      background: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
      button: "bg-purple-600 hover:bg-purple-700",
      heading: "text-white"
    },
  };

  const onSubmit = async (data) => {
    try {
      const userType = getUserType();
      console.log(userType);
      let endpoint;

      switch(userType) {
        case 'doctor':
          endpoint = 'http://localhost:5000/api/doctor/forgot-password';
          break;
        
        default:
          endpoint = 'http://localhost:5000/api/user/forgot-password';
      }
      const response = await axios.post(endpoint, data);
      toast.success('OTP sent successfully!');
         
      // Determine the correct reset password route based on user type
      const resetPasswordRoutes = {
        'doctor': '/doctor/reset-password',
        'user': '/user/reset-password',
      };

      const route = resetPasswordRoutes[userType] || '/user/reset-password';

      navigate(route, { 
        state: { 
          email: data.email,
          userType: userType 
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const userType = getUserType();
  const theme = themeConfig[userType];

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.background} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${theme.heading}`}>
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Password Recovery
          </h2>
          <p className={`mt-2 text-center text-sm ${userType !== 'user' ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your email to receive a password reset OTP
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${userType !== 'user' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`appearance-none block w-full px-3 py-2 ${userType !== 'user' ? 'bg-white/5 border-gray-600' : 'bg-white border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.button.split(' ')[0].replace('bg-', 'focus:ring-')} text-${userType !== 'user' ? 'white' : 'gray-900'}`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${theme.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.button.split('-')[1]}`}
            >
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default For;