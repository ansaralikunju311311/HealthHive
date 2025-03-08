import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import cloudinaryUpload from '../../utils/cloudinary';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { profileCompletion } from '../../Services/userServices/userApiService';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState("");
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const location = useLocation();
  const { email } = location.state;

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      let imageUrl = null;

      
      if (data.profileImage[0]) {
        imageUrl = await cloudinaryUpload(data.profileImage[0]);
      }

      const submitData = {
        email: email,
        ...data,
        profileImage: imageUrl
      };

     
      const response =await profileCompletion(submitData,{
        withCredentials:true
      })

      if (response.success || response.profileCompletion) {
        toast.success('Profile completed successfully!');
        localStorage.setItem('profileCompleted', 'true'); 
        
      
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      
        navigate('/home', { replace: true });
      } else {
        toast.error(response.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="profile-completion min-h-screen bg-gray-50" style={{
      padding: '1rem',
      margin: '0 auto',
      maxWidth: '100%',
      width: '100%',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '1rem auto',
        padding: '1rem',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>Complete Your Profile</h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Image Upload */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '2px dashed #ddd', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>Upload Photo</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              {...register('profileImage', { required: 'Profile image is required' })}
              onChange={handleImageChange}
              style={{ marginTop: '0.5rem' }}
            />
            {errors.profileImage && <span style={errorStyle}>{errors.profileImage.message}</span>}
          </div>

          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              max={new Date().toISOString().split('T')[0]} 
              {...register('dob', {
                required: 'Date of birth is required',
                onChange: (e) => calculateAge(e.target.value)
              })}
              style={inputStyle}
            />
            {errors.dob && <span style={errorStyle}>{errors.dob.message}</span>}
          </div>

          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label htmlFor="age">Age</label>
            <input
              type="text"
              id="age"
              readOnly
              value={calculatedAge}
              style={{ ...inputStyle, backgroundColor: '#f5f5f5' }}
            />
          </div>

          {/* Blood Group */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label htmlFor="bloodGroup">Blood Group</label>
            <select
              id="bloodGroup"
              {...register('bloodGroup', { required: 'Blood group is required' })}
              style={inputStyle}
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
            {errors.bloodGroup && <span style={errorStyle}>{errors.bloodGroup.message}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: { value: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
              })}
              style={inputStyle}
            />
            {errors.phone && <span style={errorStyle}>{errors.phone.message}</span>}
          </div>

          {/* Address */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              {...register('address', { required: 'Address is required' })}
              rows="3"
              style={inputStyle}
            ></textarea>
            {errors.address && <span style={errorStyle}>{errors.address.message}</span>}
          </div>

          {/* Gender */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              {...register('gender', { required: 'Gender is required' })}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span style={errorStyle}>{errors.gender.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isUploading}
            style={{
              backgroundColor: isUploading ? '#ccc' : '#007bff',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              fontSize: '16px'
            }}
          >
            {isUploading ? 'Uploading...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '16px',
  width: '100%',
  minHeight: '44px',
  '@media (max-width: 768px)': {
    fontSize: '16px',
  }
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginTop: '4px'
};

export default ProfileCompletion;