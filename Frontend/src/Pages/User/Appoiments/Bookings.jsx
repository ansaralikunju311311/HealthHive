import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../../../Common/NavBar'
import Footer from '../../../Common/Footer'
import { FaUserMd, FaStethoscope, FaClock, FaCalendarCheck, FaStar } from 'react-icons/fa'
import FeedbackModal from '../../../Component/User/UserCommons/FeedbackModal.jsx'

const Bookings = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [doctors, setDoctors] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (location.state && location.state.data) {
            setDoctors(location.state.data.doctors || [])
        }
    }, [location.state])

    const handleBookAppointment = (doctor) => {
        navigate('/bookappointment', { state: { doctor } })
    }

    const handleOpenFeedbacks = (doctor) => {
        setSelectedDoctor(doctor)
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex flex-col">
            <NavBar />
            
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6">
                            Available <span className="text-sky-600">Doctors</span>
                        </h1>

                        {doctors.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-2xl">No doctors available in this department</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                                {doctors.map((doctor) => (
                                    <div 
                                        key={doctor._id} 
                                        className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg"
                                    >
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row items-center mb-4">
                                                <img 
                                                    src={doctor.profileImage} 
                                                    alt={doctor.name} 
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4"
                                                />
                                                <div className="text-center sm:text-left">
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{doctor.name}</h3>
                                                    <p className="text-sky-600 font-medium">{doctor.specialization?.Departmentname}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4 text-gray-600">
                                                <div className="flex items-center">
                                                    <FaStethoscope className="mr-2 text-sky-500" />
                                                    <span>{doctor.specialization?.Departmentname}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="mr-2 text-sky-500" />
                                                    <span>{doctor.yearsOfExperience}+ Years Experience</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaCalendarCheck className="mr-2 text-sky-500" />
                                                    <span>Availability: {doctor.availability}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <FaStar className="mr-2 text-yellow-400" />
                                                        <span>{doctor.averageRating?.toFixed(1) || "0.0"} ({doctor.feedbacks?.length || 0} reviews)</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleOpenFeedbacks(doctor)}
                                                        className="text-sky-600 hover:text-sky-800 font-medium text-sm"
                                                    >
                                                        View Feedbacks
                                                    </button>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleBookAppointment(doctor)}
                                                className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center justify-center"
                                            >
                                                Book Appointment
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                feedbacks={selectedDoctor?.feedbacks || []}
                doctorName={selectedDoctor?.name}
            />
        </div>
    )
}

export default Bookings