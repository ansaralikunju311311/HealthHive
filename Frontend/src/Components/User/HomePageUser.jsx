import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, logout } from '../redux/Features/userSlice';
import Bannerdoctor from '../../assets/Bannerdoctor.png';
import DoctorOne from '../../assets/Doctorone.png';
import DoctorTwo from '../../assets/doctortwo.png';
import DoctorThree from '../../assets/doctorthree.png';
import DoctorFour from '../../assets/doctorfour.png';

const HomePageUser = () => {
   const [userData, setUserData] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('useraccessToken');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("from the backend data",response.data.user)
        setUserData(response.data.user);
        dispatch(setUser(response.data.user));
        setLoading(false);
      } catch (error) {
        console.error('Token verification failed:', error);
        if (error.response?.status === 401) {
          // Token invalid or expired
          dispatch(logout());
          localStorage.removeItem('useraccessToken');
          navigate('/login');
        }
        setError('Authentication failed');
        setLoading(false);
      }
    };

    verifyToken();
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('useraccessToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HealthHive</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </button>
              <button onClick={() => navigate('/user/appointments')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                My Appointments
              </button>
              <button onClick={() => navigate('/user/profile')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Profile
              </button>
              <button onClick={() => navigate('/user/medical-records')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Medical Records
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    
                    <img src={userData?.image} alt="Profile" className="h-8 w-8 rounded-full" />
                    {/* {userData?.image} */}
                  </span>
                </div>
                <span className="text-gray-700">{userData?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/user/appointments')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              My Appointments
            </button>
            <button onClick={() => navigate('/user/profile')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              Profile
            </button>
            <button onClick={() => navigate('/user/medical-records')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              Medical Records
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome back!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Book appointments, view your medical records, and manage your healthcare journey all in one place.
              </p>
              <button 
                onClick={() => navigate('/user/book-appointment')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg"
              >
                Book Appointment
              </button>
            </div>
            <div>
              <img src={Bannerdoctor} alt="Healthcare Professional" className="w-full rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Book Appointment',
                description: 'Schedule a consultation with our expert doctors',
                action: () => navigate('/user/book-appointment')
              },
              { 
                title: 'View Records',
                description: 'Access your medical history and test results',
                action: () => navigate('/user/medical-records')
              },
              { 
                title: 'Update Profile',
                description: 'Keep your personal information up to date',
                action: () => navigate('/user/profile')
              }
            ].map((action, index) => (
              <div 
                key={index}
                onClick={action.action}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Doctors */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Available Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialty: "Cardiologist",
                experience: "15+ Years Experience",
                image: DoctorOne,
                availability: "Available Today"
              },
              {
                name: "Dr. Michael Chen",
                specialty: "Neurologist",
                experience: "12+ Years Experience",
                image: DoctorTwo,
                availability: "Next Available: Tomorrow"
              },
              {
                name: "Dr. Emily Parker",
                specialty: "Pediatrician",
                experience: "10+ Years Experience",
                image: DoctorThree,
                availability: "Available Today"
              },
              {
                name: "Dr. James Wilson",
                specialty: "Orthopedic Surgeon",
                experience: "18+ Years Experience",
                image: DoctorFour,
                availability: "Next Available: Monday"
              }
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600">{doctor.specialty}</p>
                  <p className="text-gray-600 text-sm">{doctor.experience}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {doctor.availability}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/user/book-appointment')}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Health Tips & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "COVID-19 Updates",
                description: "Stay informed about the latest COVID-19 guidelines and vaccination information."
              },
              {
                title: "Healthy Living",
                description: "Tips for maintaining a healthy lifestyle, including diet and exercise recommendations."
              },
              {
                title: "Mental Wellness",
                description: "Resources and support for maintaining good mental health and managing stress."
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
                <button className="mt-4 text-blue-600 hover:text-blue-800">Learn More →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageUser;