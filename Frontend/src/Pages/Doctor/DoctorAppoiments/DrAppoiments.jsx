import React, { useEffect, useState } from 'react'
import Sidebar from '../../../Component/Doctor/Sidebar';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PrescriptionModal from '../../../Component/Doctor/Prescription';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaVenusMars,
  FaComments,
  FaChevronLeft, 
  FaChevronRight ,
  FaPrescriptionBottleAlt
} from 'react-icons/fa';
import { drAppoinments } from '../../../Services/doctorService/doctorService';

const groupAppointmentsByCategory = (appointments) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const categories = {
    today: [],
    upcoming: [],
    past: []
  };

  appointments.forEach(appointment => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate.getTime() === today.getTime()) {
      categories.today.push(appointment);
    } else if (appointmentDate > today) {
      categories.upcoming.push(appointment);
    } else {
      categories.past.push(appointment);
    }
  });

  return categories;
};

const ViewDetailsModal = ({ appointment, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl mx-4 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{appointment.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{appointment.user.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{appointment.user.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{appointment.user.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Slot</p>
                <p className="font-medium">{appointment.time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



const AppointmentSection = ({ title, appointments, icon: Icon, setSelectedPrescriptionAppointment, setIsPrescriptionModalOpen }) => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('doctorId');
  const DrdoctorId = JSON.parse(doctorId);
  const doctor_Id = DrdoctorId._id;
  
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (appointments.length === 0) return null;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChat = (patientId, doctor_Id) => {
    navigate('/doctor/chats', { state: { userId: patientId, doctorId: doctor_Id } });
  };

  return (
    <div className="mb-6 sm:mb-8 animate-fadeIn w-full">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 border-b pb-3 flex flex-wrap items-center gap-2">
        {Icon && <Icon className="text-blue-600" size={20} />}
        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          {title}
        </span>
        <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {appointments.length}
        </span>
      </h3>

      <div className="grid gap-4 sm:gap-6">
        {currentAppointments.map((appointment) => (
          <div key={appointment._id} className="transform transition-all duration-300 hover:scale-[1.01] rounded-xl shadow-sm hover:shadow-lg">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex justify-center sm:justify-start">
                  {appointment.user.image ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                      <img src={appointment.user.image} alt={appointment.user.name} 
                           className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                      <FaUserCircle className="text-4xl sm:text-5xl text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-grow space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                    <h4 className="text-xl font-bold text-gray-900 text-center sm:text-left">
                      {appointment.user.name}
                    </h4>
                    <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center whitespace-nowrap">
                      <FaClock className="mr-1.5" size={14} />
                      {appointment.slot}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { icon: FaVenusMars, text: appointment.user.gender },
                      { icon: FaUserMd, text: `${appointment.user.age} years` },
                      { icon: FaCalendarAlt, text: new Date(appointment.date).toLocaleDateString() }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <item.icon className="text-blue-600 flex-shrink-0" size={16} />
                        <span className="font-medium text-sm sm:text-base truncate">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
                    <button 
                      onClick={() => handleChat(appointment.user._id, doctor_Id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm"
                    >
                      <FaComments className="mr-2" size={16} />
                      Chat with Patient
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-gray-50 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-200 text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPrescriptionAppointment(appointment);
                        setIsPrescriptionModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition transform duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                    >
                      <FaPrescriptionBottleAlt className="mr-2" size={18} />
                      Send Prescription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <FaChevronLeft />
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-8 h-8 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
      
      <ViewDetailsModal 
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
};

const DrAppoiments = () => {
  // Insert doctor data extraction at the top of the component
  const doctorData = localStorage.getItem('doctorId');
  const doctor = doctorData ? JSON.parse(doctorData) : {};
  const doctor_Id = doctor._id;

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptionAppointment, setSelectedPrescriptionAppointment] = useState(null);
  
  useEffect(() => {
    const fetchAppoiments = async () => {
      try {
        const response = await drAppoinments(doctor_Id);
        setAppointments(response);
        setFilteredAppointments(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchAppoiments();
  }, [doctor_Id]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getFullYear() === selectedDate.getFullYear() &&
          appointmentDate.getMonth() === selectedDate.getMonth() &&
          appointmentDate.getDate() === selectedDate.getDate()
        );
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedDate, appointments]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar activePage="Appointments" />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const { today, upcoming, past } = groupAppointmentsByCategory(filteredAppointments);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
      <Sidebar activePage="Appointments" />
      <div className="flex-grow p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Appointments Dashboard
            </h2>
            
            <div className="w-full sm:w-auto bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-600 flex-shrink-0" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="w-full sm:w-48 px-3 py-2 text-sm border-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  placeholderText="Filter by date"
                  isClearable
                />
              </div>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">
                {selectedDate 
                  ? "No appointments scheduled for this date" 
                  : "No appointments found"
                }
              </p>
            </div>
          ) : (
            <>
              <AppointmentSection 
                title="Today" 
                appointments={today} 
                icon={FaCalendarAlt}
                setSelectedPrescriptionAppointment={setSelectedPrescriptionAppointment}
                setIsPrescriptionModalOpen={setIsPrescriptionModalOpen}
              />
              <AppointmentSection 
                title="Upcoming" 
                appointments={upcoming} 
                icon={FaClock}
                setSelectedPrescriptionAppointment={setSelectedPrescriptionAppointment}
                setIsPrescriptionModalOpen={setIsPrescriptionModalOpen}
              />
              <AppointmentSection 
                title="Past" 
                appointments={past}
                setSelectedPrescriptionAppointment={setSelectedPrescriptionAppointment}
                setIsPrescriptionModalOpen={setIsPrescriptionModalOpen}
              />
            </>
          )}
        </div>
      </div>
      <PrescriptionModal 
        doctorId={doctor_Id}
        // appointments={selectedAppointment}
        appointment={selectedPrescriptionAppointment}
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setSelectedPrescriptionAppointment(null);
        }}

      />
    </div>
  );
}

export default DrAppoiments;