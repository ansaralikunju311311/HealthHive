import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { drProfile ,drupdateDoctorProfile} from '../../Services/doctorService/doctorService';
import axios from 'axios';

const DocumentModal = ({ isOpen, onClose, imageUrl, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                <div className="p-3 sm:p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-3 sm:p-4">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600?text=No+Document';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
const Profile = () => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null); 
    const [editing, setEditing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.userId;

    const handleBack = () => {
        navigate('/doctor/dashboard');
    };

    const updateDoctorProfile = async () => {
        try {
           
            const response = await drupdateDoctorProfile(id,doctor.consultFee,doctor.about)
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            updateDoctorProfile();
        }
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const doctorProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await drProfile(id);
                
                setDoctor(response.doctorData);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch doctor profile");
                console.error("Error fetching doctor profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            doctorProfile();
        } else {
            setError("No doctor ID provided");
            setLoading(false);
        }
    }, [id]);

    const DocumentCard = ({ title, imageUrl }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h5 className="font-semibold text-gray-800">{title}</h5>
                <button 
                    onClick={() => setSelectedDocument({ title, imageUrl })}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                    <span>View Document</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedDocument({ title, imageUrl })}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Document';
                    }}
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error || "No doctor data available"}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Dashboard</span>
                    </button>
                    <div className="text-sm text-gray-500">
                        Doctor Profile
                    </div>
                    <button onClick={handleEditToggle} className="text-blue-600 hover:text-blue-700 font-medium">
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                    <div className="flex flex-col items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-t-2xl">
                        <div className="relative mb-6">
                            <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                                <img
                                    src={doctor.profileImage}
                                    alt={`${doctor.name}'s profile`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-center space-y-3">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-800">{doctor.name}</h3>
                                <p className="text-xl text-blue-600 font-semibold mt-1">{doctor.specialization?.Departmentname}</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 mt-4">
                                <div className="bg-blue-50 px-6 py-3 rounded-xl">
                                    <p className="text-sm text-gray-600 font-medium">Experience</p>
                                    <p className="text-lg font-bold text-blue-700">{doctor.yearsOfExperience} Years</p>
                                </div>
                                <div className="bg-purple-50 px-6 py-3 rounded-xl">
                                    <p className="text-sm text-gray-600 font-medium">Consultation Fee</p>
                                    {isEditing ? (
                                        <input type="number" value={doctor.consultFee} onChange={(e) => setDoctor({...doctor, consultFee: e.target.value})} className="text-lg font-bold text-purple-700" />
                                    ) : (
                                        <p className="text-lg font-bold text-purple-700">₹{doctor.consultFee}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                About Doctor
                            </h4>
                            {isEditing ? (
                                <textarea value={doctor.about} onChange={(e) => setDoctor({...doctor, about: e.target.value})} className="text-gray-700 leading-relaxed text-lg" />
                            ) : (
                                <p className="text-gray-700 leading-relaxed text-lg">{doctor.about}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Information
                                </h4>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-gray-800 font-medium mt-1">{doctor.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                        <p className="text-gray-800 font-medium mt-1">{doctor.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Personal Information
                                </h4>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500">Gender</p>
                                        <p className="text-gray-800 font-medium mt-1 capitalize">{doctor.gender}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500">Specialization</p>
                                        <p className="text-gray-800 font-medium mt-1">{doctor.specialization?.Departmentname}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Verification Documents
                            </h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <DocumentCard
                                    title="Medical License"
                                    imageUrl={doctor.medicalLicense}
                                />
                                <DocumentCard
                                    title="ID Proof"
                                    imageUrl={doctor.idProof}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={handleBack}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return to Dashboard
                    </button>
                </div>
            </div>
            <DocumentModal
                isOpen={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}
                imageUrl={selectedDocument?.imageUrl}
                title={selectedDocument?.title}
            />
        </div>
    );
};
export default Profile;