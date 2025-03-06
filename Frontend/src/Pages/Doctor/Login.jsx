import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import { toast } from 'react-toastify';

import { setDoctor, setToken } from '../../redux/Features/DoctorSlice';
import { doctorLogin } from '../../Services/apiService';

const Login = () => {
    const navigate = useNavigate()
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        try {
            const { doctor } = await doctorLogin(data, { withCredentials: true });
 
            if (doctor.isActive === false) {
                toast.error('Your account is pending verification');
                navigate('/beforeverification');
            } else if (doctor.isBlocked===true) {
                toast.error('Your account has been blocked. Please contact support.', {
                    icon: '⛔',
                    backgroundColor: '#ef4444'
                });
                return;
            } else {
                toast.success('Welcome back, Dr. ' + doctor.name, {
                    icon: '👋',
                    backgroundColor: '#22c55e'
                });
                navigate('/doctor/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.message || 'Login failed');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Doctor Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                placeholder="doctor@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                   

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => navigate('/doctor/signup')}
                                className="font-medium text-purple-300 hover:text-purple-400 transition-colors"
                            >
                                Don't have an account? Sign up
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/doctor/forgotpassword')}
                                className="font-medium text-purple-300 hover:text-purple-400 transition-colors ml-9"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
