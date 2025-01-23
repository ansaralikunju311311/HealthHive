import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Bannerdoctor from '../../assets/Bannerdoctor.png';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken } from '../../Components/redux/Features/userSlice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  console.log("user from redux:", user);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', data);
      console.log(response.data);

      // Save user data in Redux store and session storage
      sessionStorage.setItem('useraccessToken', response.data.accessToken);
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.accessToken));
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
    hdbvhfsbgvhilsfhbvhlfbvkjdfbkjdfbnkdkjgfbxkjlgd
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <div className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  email
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('email', { required: true })}
                  />
                  {errors.email && <span className="text-red-500">This field is required</span>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="appearance-none rounded-xl relative block w-full pl-10 px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 {...register('password', { required: true })}
                  />
                  {errors.password && <span className="text-red-500">This field is required</span>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  {/* <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?

                  </a> */}    <p><Link to="/forgot-password">Forgot password?</Link></p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign in
                </button>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>
              <button
                onClick={() => navigate('/signup')}
                className="ml-2 font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <h1>helllooooooooooooooo</h1>
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src={Bannerdoctor} 
          alt="Healthcare Professional" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 flex items-center justify-center">
          <div className="text-white max-w-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Welcome to HealthHive</h2>
            <p className="text-xl mb-8">Access your healthcare services with ease and security</p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-white/10 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <span className="text-lg">Secure access to your health records</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/10 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">24/7 access to healthcare services</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
