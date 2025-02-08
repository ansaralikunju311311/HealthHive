import React, { useEffect, useState } from 'react'
import Sidebar from '../../../Component/Doctor/Sidebar';
import axios from 'axios';
import { 
  FaUserCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaVenusMars, 

} from 'react-icons/fa';

const AppointmentTimeline = ({ appointments }) => {
  const groupAppointmentsByDate = () => {
    return appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {});
  };

  const groupedAppointments = groupAppointmentsByDate();

  return (
    <div className="space-y-8">
      {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
        <div key={date} className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            <FaCalendarAlt className="inline-block mr-2 text-blue-500" />
            {date}
          </h3>
          <div className="space-y-4">
            {dayAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DrAppoiments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const DrdoctorId = JSON.parse(doctorId);
    const doctor_Id = DrdoctorId._id;

    const fetchAppoiments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/appointments/${doctor_Id}`);
        setAppointments(response.data);
        console.log("============",response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchAppoiments();
  }, []);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="Appointments" />
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Upcoming Appointments
          </h2>
          
          {appointments.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-xl text-gray-600">No appointments scheduled</p>
            </div>
          ) : (
            <AppointmentTimeline appointments={appointments} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DrAppoiments;