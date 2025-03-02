import React, { useEffect, useState } from 'react'
import Sidebar from '../../../Component/Doctor/Sidebar';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaVenusMars,
  FaComments,
  FaChevronLeft, 
  FaChevronRight 
} from 'react-icons/fa';
import { DrAppoinments } from '../../../Services/apiService';

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

const AppointmentSection = ({ title, appointments, icon: Icon }) => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('doctorId');
  const DrdoctorId = JSON.parse(doctorId);
  const doctor_Id = DrdoctorId._id;
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;
  
  // Calculate pagination values
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  if (appointments.length === 0) return null;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChat = (patientId, doctor_Id) => {
    console.log("patientId,doctor_Id==================  ",patientId,doctor_Id);
    navigate('/doctor/chats', { state: { userId: patientId, doctorId: doctor_Id } });
  };

  return (
    <div className="mb-8 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 flex items-center">
        {Icon && <Icon className="mr-3 text-blue-600" size={24} />}
        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          {title}
        </span>
        <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {appointments.length}
        </span>
      </h3>
      <div className="grid gap-6">
        {currentAppointments.map((appointment) => (
          <div 
            key={appointment._id} 
            className={`transform transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-xl ${
              title === 'Today' 
                ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-100' 
                : title === 'Upcoming'
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
                : 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100'
            }`}
          >
            <div className="p-6 flex items-start space-x-6">
              <div className="flex-shrink-0">
                {appointment.user.image ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                    <img 
                      src={appointment.user.image} 
                      alt={appointment.user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                    <FaUserCircle className="text-4xl text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-gray-900">
                    {appointment.user.name}
                  </h4>
                  <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium flex items-center">
                    <FaClock className="mr-2" />
                    {appointment.slot}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {[
                    { icon: FaVenusMars, text: appointment.user.gender },
                    { icon: FaUserMd, text: `${appointment.user.age} years` },
                    { icon: FaCalendarAlt, text: new Date(appointment.date).toLocaleDateString() }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-600">
                      <item.icon className="text-blue-600" />
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button 
                    onClick={() => handleChat(appointment.user._id, doctor_Id)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <FaComments className="mr-2" />
                    Chat with Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

const DrAppoiments = () => {
  const navigate = useNavigate();

  
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  
  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const DrdoctorId = JSON.parse(doctorId);
    const doctor_Id = DrdoctorId._id;
  

    

    const fetchAppoiments = async () => {
      try {
        // const response = await axios.get(`http://localhost:5000/api/doctor/appointments/${doctor_Id}`);
        const response = await DrAppoinments(doctor_Id);
        setAppointments(response);
        setFilteredAppointments(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchAppoiments();
  }, []);

  // Filter appointments when date is selected
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
      // If no date is selected, show all appointments
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage="Appointments" />
      <div className="flex-grow p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Appointments Dashboard
            </h2>
            
            <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm">
              <FaCalendarAlt className="text-blue-600" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="form-input w-48 px-4 py-2 border-none focus:ring-2 focus:ring-blue-500 rounded-md"
                placeholderText="Filter by date"
                isClearable
              />
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
              <AppointmentSection title="Today" appointments={today} icon={FaCalendarAlt} />
              <AppointmentSection title="Upcoming" appointments={upcoming} icon={FaClock} />
              <AppointmentSection title="Past" appointments={past} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrAppoiments;