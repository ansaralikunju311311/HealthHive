import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setDoctor,} from '../../Components/redux/Features/doctorSlice';

const SignUp = () => {
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [medicalLicenseUrl, setMedicalLicenseUrl] = useState('');
    const [idProofUrl, setIdProofUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    
    // For local preview before upload
    const [profilePreview, setProfilePreview] = useState('');
    const [licensePreview, setLicensePreview] = useState('');
    const [idProofPreview, setIdProofPreview] = useState('');
   const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm()
    const navigate = useNavigate()

    const handleImageUpload = async (file, type) => {
        if (!file) return;
        
        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            switch(type) {
                case 'profile':
                    setProfilePreview(reader.result);
                    break;
                case 'license':
                    setLicensePreview(reader.result);
                    break;
                case 'idProof':
                    setIdProofPreview(reader.result);
                    break;
                default:
                    break;
            }
        };
        reader.readAsDataURL(file);
        
        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "testing");
        
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dliraelbo/image/upload', data);
            const imageUrl = response.data.url;
            
            switch(type) {
                case 'profile':
                    setProfileImageUrl(imageUrl);
                    break;
                case 'license':
                    setMedicalLicenseUrl(imageUrl);
                    break;
                case 'idProof':
                    setIdProofUrl(imageUrl);
                    break;
                default:
                    break;
            }
        } catch(error) {
            console.log('Error uploading image:', error);
            // Reset preview on error
            switch(type) {
                case 'profile':
                    setProfilePreview('');
                    break;
                case 'license':
                    setLicensePreview('');
                    break;
                case 'idProof':
                    setIdProofPreview('');
                    break;
                default:
                    break;
            }
        } finally {
            setIsUploading(false);
        }
    }
 
    const onSubmit = async (data) => {
        try {
            // Check if all required images are uploaded
            if (!profileImageUrl || !medicalLicenseUrl || !idProofUrl) {
                console.log('Please upload all required images');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/doctor/signup', {
                name: data.name,  
                email: data.email,
                password: data.password,
                phone: data.phone,
                yearsOfExperience: parseInt(data.yearsOfExperience),  
                specialization: data.specialization,  
                profileImage: profileImageUrl,
                medicalLicense: medicalLicenseUrl,
                about: data.about,
                consultFee: data.consultationFee,
                gender: data.gender,
                idProof: idProofUrl,

            });
            dispatch(setDoctor(response.data.user));
            console.log("responnse come backend",response.data);
            console.log("debuggin isActivate======",response.data.user.isActive)
    console.log("user details======",response.data.user);
            
            if(response.data.user.isActive===false){
                navigate('/before-verification', { state: { email: data.email } });
            }
            else{
                navigate('/doctor-login');
            }
            
            // Navigate to login on successful signup
            
        } catch(error) {
            console.log('Error during signup:', error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Floating Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Header */}
                <div className="text-center relative z-10 mb-16">
                    <h1 className="text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Join Our Medical Network
                    </h1>
                    <p className="text-xl text-purple-200">Empowering Healthcare Professionals</p>
                </div>

                {/* Main Form */}
                <div className="relative z-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Profile Section */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Profile Picture Upload */}
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                            {profilePreview ? (
                                                <img 
                                                    src={profilePreview} 
                                                    alt="Profile Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg className="w-16 h-16 text-purple-300 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files[0], 'profile')} 
                                    />
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                            placeholder="Dr. John Doe"
                                            {...register("name", {
                                                required: "Name is required",
                                                minLength: {
                                                    value: 3,
                                                    message: "Name must be at least 3 characters long"
                                                }
                                            })}
                                        />
                                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                            placeholder="doctor@example.com"
                                            {...register("email",{required:true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:"email is required"})}
                                        />
                                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Gender</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors"
                                        {...register("gender", {
                                            required: "Gender is required"
                                        })}
                                    >
                                        <option value="" className="bg-gray-900">Select Gender</option>
                                        <option value="female" className="bg-gray-900">Female</option>
                                        <option value="male" className="bg-gray-900">Male</option>
                                        <option value="other" className="bg-gray-900">Other</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Professional Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Phone Number</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                        placeholder="Enter phone number"
                                        {...register("phone", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^\d{10}$/,
                                                message: "Please enter a valid 10-digit phone number"
                                            }
                                        })}
                                    />
                                    {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Consultation Fee</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                        placeholder="Enter consultation fee"
                                        {...register("consultationFee", {
                                            required: "Consultation fee is required",
                                            minLength: 3
                                        })}
                                    />
                                    {errors.consultationFee && <p className="text-red-500">{errors.consultationFee.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Specialization</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors"
                                        {...register("specialization", {
                                            required: "Specialization is required"
                                        })}
                                    >
                                        <option value="" className="bg-gray-900">Select Specialization</option>
                                        <option value="cardiology" className="bg-gray-900">Cardiology</option>
                                        <option value="dermatology" className="bg-gray-900">Dermatology</option>
                                        <option value="neurology" className="bg-gray-900">Neurology</option>
                                        <option value="orthopedics" className="bg-gray-900">Orthopedics</option>
                                        <option value="pediatrics" className="bg-gray-900">Pediatrics</option>
                                        <option value="psychiatry" className="bg-gray-900">Psychiatry</option>
                                    </select>
                                    {errors.specialization && <p className="text-red-500">{errors.specialization.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Years of Experience</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                        placeholder="Enter years of experience"
                                        {...register("yearsOfExperience", {
                                            required: "Years of experience is required",
                                            min: {
                                                value: 0,
                                                message: "Years of experience cannot be negative"
                                            }
                                        })}
                                    />
                                    {errors.yearsOfExperience && <p className="text-red-500">{errors.yearsOfExperience.message}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-purple-300 mb-2">About</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors h-32 resize-none"
                                        placeholder="Tell us about your medical background and expertise..."
                                        {...register("about", {
                                            required: "About section is required",
                                            minLength: {
                                                value: 20,
                                                message: "Please provide at least 20 characters"
                                            }
                                        })}
                                    />
                                    {errors.about && <p className="text-red-500">{errors.about.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Required Documents</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Medical License */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-4">Medical License</label>
                                    <div className="relative group">
                                        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-purple-400/30 border-dashed rounded-xl p-6 hover:border-purple-400 transition-colors">
                                            {licensePreview ? (
                                                <div className="relative w-full h-full">
                                                    <img 
                                                        src={licensePreview} 
                                                        alt="License Preview" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <button 
                                                        onClick={() => setLicensePreview('')}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-sm text-purple-300 text-center">
                                                        <span className="font-medium text-purple-400">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-purple-400/70 mt-2">PDF or images up to 10MB</p>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                            onChange={(e) => handleImageUpload(e.target.files[0], 'license')}
                                        />
                                    </div>
                                </div>

                                {/* ID Proof */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-4">ID Proof</label>
                                    <div className="relative group">
                                        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-purple-400/30 border-dashed rounded-xl p-6 hover:border-purple-400 transition-colors">
                                            {idProofPreview ? (
                                                <div className="relative w-full h-full">
                                                    <img 
                                                        src={idProofPreview} 
                                                        alt="ID Proof Preview" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <button 
                                                        onClick={() => setIdProofPreview('')}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                                    </svg>
                                                    <p className="text-sm text-purple-300 text-center">
                                                        <span className="font-medium text-purple-400">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-purple-400/70 mt-2">PDF or images up to 10MB</p>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                            onChange={(e) => handleImageUpload(e.target.files[0], 'idProof')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Security</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                        placeholder="Create a strong password"
                                     {...register("password",{required:true,message:"password is required", minLength:8,maxLength:20})}
                                    />
                                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-purple-300 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                                        placeholder="Confirm your password"
                                     {...register("confirmPassword",{required:true,validate: (value) => value === getValues("password")})}
                                    />
                                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/doctor-login')}
                                className="text-purple-300 hover:text-purple-400 transition-colors"
                            >
                                Already have an account? Sign in
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Complete Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp
