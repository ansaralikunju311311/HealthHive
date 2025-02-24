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
  FaComments
} from 'react-icons/fa';

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
  const handleChat = (patientId, doctor_Id) => {
    console.log("patientId,doctor_Id==================  ",patientId,doctor_Id);
    navigate('/doctor/chats', { state: { userId: patientId, doctorId: doctor_Id } });
  };

  if (appointments.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
        {Icon && <Icon className="mr-2 text-blue-500" />}
        {title}
        <span className="ml-2 text-sm text-gray-500">({appointments.length})</span>
      </h3>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div 
            key={appointment._id} 
            className={`flex items-center p-4 rounded-lg transition-colors ${
              title === 'Today' 
                ? 'bg-green-50 hover:bg-green-100' 
                : title === 'Upcoming'
                ? 'bg-blue-50 hover:bg-blue-100'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex-shrink-0 mr-4">
              {appointment.user.image ? (
                <img 
                  src={appointment.user.image} 
                  alt={appointment.user.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-5xl text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">
                  {appointment.user.name}
                </h4>
                <span className="text-sm text-gray-500">
                  <FaClock className="inline-block mr-1" />
                  {appointment.slot}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaVenusMars className="mr-2 text-blue-500" />
                  {appointment.user.gender}
                </div>
                <div className="flex items-center">
                  <FaUserMd className="mr-2 text-blue-500" />
                  {appointment.user.age} years
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow flex items-center gap-2"
                onClick={() => handleChat(appointment.user._id, doctor_Id)}>
                  <FaComments /> Chat with Patient
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
        const response = await axios.get(`http://localhost:5000/api/doctor/appointments/${doctor_Id}`);
        setAppointments(response.data);
        setFilteredAppointments(response.data);
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="Appointments" />
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Appointments
          </h2>
          
          {/* Date Picker */}
          <div className="mb-6 flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="form-input w-64 px-4 py-2 border rounded-md"
              placeholderText="Select a date"
              isClearable
            />
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-xl text-gray-600">
                {selectedDate 
                  ? "No appointments on this date" 
                  : "No appointments scheduled"
                }
              </p>
            </div>
          ) : (
            <>
              <AppointmentSection 
                title="Today" 
                appointments={today} 
                icon={FaCalendarAlt} 
              />
              <AppointmentSection 
                title="Upcoming" 
                appointments={upcoming} 
                icon={FaClock} 
              />
              <AppointmentSection 
                title="Past" 
                appointments={past} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrAppoiments;