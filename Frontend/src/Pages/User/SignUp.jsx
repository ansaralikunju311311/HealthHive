import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Bannerdoctor from '../../assets/Bannerdoctor.png';
import axios from 'axios'; // Only needed for Cloudinary upload
import Google from '../../Component/User/Google/Google.jsx';
// import {auth} from '../../../Firebase/config.js'
import {auth} from '../../Firebase/config.js'
import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
// Import the API service
import { registerUser } from '../../Services/userServices/userApiService.js';
import cloudinaryUpload from '../../utils/cloudinary';

const SignUp = () => {




  const sample =  async() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async(result)=>{

    console.log(result.user.email, result.user.displayName, result.user.uid)


   
      const response = await axios.post('http://localhost:5000/api/user/google-signup', {
        email: result.user.email,
        name: result.user.displayName,
        uid: result.user.uid
      });
      navigate('/profilecompletion', { state: { email: result.user.email } });
      console.log(result)
    })
  }

  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [calculatedAge, setCalculatedAge] = useState("");

  const calculateAge = (birthDate) => {
    if (!birthDate) return;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const ageString = `${years} years, ${months} months, ${days} days`;
    setCalculatedAge(ageString);
    setValue('age', ageString); 
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImagePreview(URL.createObjectURL(file));
      
      const imageUrl = await cloudinaryUpload(file);
      setImage(imageUrl);
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview(null); 
    }
  }

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser({
        ...data,
        image: image
      });

      toast.success('Account created successfully!');
      navigate('/generate-otp', { state: { email: data.email } });
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={Bannerdoctor}
          alt="Healthcare Professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 flex items-center justify-center">
          <div className="text-white max-w-xl p-12">
            <h2 className="text-4xl font-bold mb-6">Welcome to HealthHive</h2>
            <p className="text-xl mb-8">Your trusted healthcare partner for a better tomorrow</p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-white/10 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <span className="text-lg">Join our growing community</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/10 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Quality healthcare services</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/10 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Secure and confidential</span>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us for better healthcare management</p>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-blue-200">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <label htmlFor="image" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    {...register("image")}
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your username"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name should be at least 3 characters"
                    },
                    maxLength: {
                      value: 20,
                      message: "Name should not exceed 20 characters"
                    }
                  })}
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  id="bloodGroup"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("bloodGroup", {
                    required: "Blood group is required"
                  })}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodGroup && <p className="text-red-500">{errors.bloodGroup.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number"
                    }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="text"
                  id="age"
                  readOnly
                  value={calculatedAge}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm"
                />
                {errors.age && <p className="text-red-500">{errors.age.message}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  id="address"
                  placeholder="Enter your full address"
                  rows="3"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  {...register("address", {
                    required: "Address is required",
                    minLength: {
                      value: 10,
                      message: "Address should be at least 10 characters"
                    }
                  })}
                />
                {errors.address && <p className="text-red-500">{errors.address.message}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  id="gender"
                  {...register("gender", {
                    required: "Gender is required"
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  max={new Date().toISOString().split('T')[0]} // Prevents future dates
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                    onChange: (e) => calculateAge(e.target.value)
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password should be at least 8 characters"
                    }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) => value === getValues("password")
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign Up
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>
              <button
                onClick={() => navigate('/login')}
                className="ml-2 font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <Google onClick={sample}/>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
