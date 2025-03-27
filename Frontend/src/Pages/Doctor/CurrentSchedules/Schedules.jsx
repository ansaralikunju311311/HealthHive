// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../../Component/Doctor/Sidebar';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { schedule,exstingSchedules } from '../../../Services/doctorService/doctorService';
// const Schedules = () => {
//     const storedDoctorId = localStorage.getItem('doctorId');
//     let doctorId;
//     try {
//         const parsedDoctorId = JSON.parse(storedDoctorId);
//         doctorId = parsedDoctorId._id;
//     } catch (error) {
//         doctorId = storedDoctorId;
//     }
//     console.log("Doctor ID in Schedules:", doctorId);

//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
//     const [existingSchedules, setExistingSchedules] = useState([]);
//     console.log("Selected Time Slots:", selectedTimeSlots);

//     const handleSchedule = async () => {
//         console.log("Initial Selected Date:", selectedDate);
//         console.log("Initial Selected Time Slots:", selectedTimeSlots);
//         if (!selectedDate) {
//             toast.error("Please select a date");
//             return;
//         }
//         const selectedDateKey = selectedDate.toDateString();
//         console.log("Selected Date Key:", selectedDateKey);

//         if (!selectedTimeSlots[selectedDateKey] || selectedTimeSlots[selectedDateKey].length === 0) {
//             toast.error("Please select a time slot");
//             return;
//         }
//         setIsOpen(false);  
//         try {
//             const appointmentsData = Object.entries(selectedTimeSlots).flatMap(([date, slots]) => 
//                 slots.map(slot => {
//                     console.log("Processing Slot:", slot);
//                     console.log("Date:", date);

//                     const [startTime, endTime] = slot.label.split(' - ');
//                     console.log("Start Time:", startTime);

//                     const appointmentDate = new Date(date);
//                     const [hour, period] = startTime.split(' ');
//                     const hourNum = parseInt(hour);
                    
//                     const adjustedHour = period === 'PM' && hourNum !== 12 
//                         ? hourNum + 12 
//                         : (period === 'AM' && hourNum === 12 
//                             ? 0 
//                             : hourNum);
                    
//                     appointmentDate.setHours(adjustedHour, 0, 0, 0);

//                     const formattedAppointmentDate = appointmentDate.toISOString().split('T')[0];

//                     return {
//                         appointmentDate: formattedAppointmentDate,
//                         slotTime: slot.label,
//                         bookingTime: new Date()
//                     };
//                 })
//             );
//             console.log("Prepared Appointments Data:", appointmentsData);
           
//             const response = await schedule(doctorId, appointmentsData);

//             console.log("Schedule Response:", response.data);
            
//             const newSchedules = appointmentsData.map(appointment => ({
//                 appointmentDate: appointment.appointmentDate,
//                 slotTime: appointment.slotTime,
//                 isBooked: false
//             }));
            
//             setExistingSchedules(prevSchedules => [...prevSchedules, ...newSchedules]);
            
//             setSelectedDate(null);
//             setSelectedTimeSlots({});
//             toast.success('Schedule submitted successfully!');
//         } catch (error) {
//             console.error('Schedule submission error:', error);
//             console.error('Error Details:', error.response ? error.response.data : error.message);
//             toast.error('Failed to submit schedule. Please try again.');
//         }
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setSelectedDate(null);
//         setSelectedTimeSlots({});
//     };

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const maxDate = new Date(today);
//     maxDate.setDate(maxDate.getDate() + 2);

//     const format12Hour = (hour) => {
//         const suffix = hour >= 12 ? "PM" : "AM";
//         const formattedHour = hour % 12 || 12; 
//         return `${formattedHour} ${suffix}`;
//     };

//     const generateTimeSlots = () => {
//         const slots = [];
//         let startHour = 12; 
//         let endHour = 19; 

//         for (let hour = startHour; hour < endHour; hour++) {
//             let startTime = new Date();
//             startTime.setHours(hour, 0, 0, 0); 

//             const label = `${format12Hour(hour)} - ${format12Hour(hour + 1)}`;
//             slots.push({ label, time: startTime });
//         }
//         return slots;
//     };

//     const timeSlots = generateTimeSlots();

//     const handleTimeSlotClick = (slot) => {
//         if (!selectedDate) return;

//         const dateKey = selectedDate.toDateString();

//         setSelectedTimeSlots((prev) => {
//             const currentDateSlots = prev[dateKey] || [];
//             const isSelected = currentDateSlots.some((selectedSlot) => selectedSlot.label === slot.label);
//             console.log("Is Selected:", isSelected);
//             if (isSelected) {
//                 return {
//                     ...prev,
//                     [dateKey]: currentDateSlots.filter((selectedSlot) => selectedSlot.label !== slot.label),
//                 };
//             } else {
//                 return {
//                     ...prev,
//                     [dateKey]: [...currentDateSlots, slot],
//                 };
//             }
//         });
//     };

//     const isPastSlot = (slot) => {
//         if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
//             const now = new Date();
//             now.setMinutes(0, 0, 0); 
//             return slot.time <= now;
//         }
//         return false;
//     };

//     const fetchExistingSchedules = async () => {
//         try {
          
//             const response = await exstingSchedules(doctorId);
            
//             setExistingSchedules(response.schedules || []);

//             console.log("Existing Schedules:", response.schedules);
//         } catch (error) {
//             console.error('Error fetching schedules:', error);
//             setExistingSchedules([]);
//         }
//     };

//     useEffect(() => {
//         fetchExistingSchedules();
//     }, [doctorId]);

//     return (
//         <div className="flex min-h-screen bg-gray-50">
//             <Sidebar activePage="Schedules" />
//             <div className="flex-1 md:ml-64 transition-all duration-300">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                         <div>
//                             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Manage Schedules</h1>
//                             <p className="mt-1 text-sm sm:text-base text-gray-600">Set your availability and manage time slots</p>
//                         </div>
//                     </div>
//                     <div className="mb-8">
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             Existing Schedules
//                         </h2>
//                         <button
//                             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                             onClick={() => setIsOpen(true)}
//                         >
//                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                             </svg>
//                             Schedule Appointment
//                         </button>
//                     </div>
//                     {existingSchedules.length === 0 ? (
//                         <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
//                             <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             <p className="text-gray-500 text-lg">No schedules found</p>
//                             <p className="text-gray-400 mt-2">Click the button above to create a new schedule</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {(() => {
//                                 const schedulesByDate = existingSchedules.reduce((acc, schedule) => {
//                                     const dateKey = schedule.appointmentDate; 

//                                     if (!acc[dateKey]) {
//                                         acc[dateKey] = {
//                                             date: dateKey,
//                                             slots: []
//                                         };
//                                     }
//                                     acc[dateKey].slots.push(schedule); 
//                                     return acc;
//                                 }, {});
//                                 return Object.values(schedulesByDate)
//                                     .map((dateGroup, index) => (
//                                         <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
//                                             <div className="flex items-center gap-2 mb-4">
//                                                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                                 </svg>
//                                                 <h3 className="text-lg font-semibold text-gray-900">{dateGroup.date}</h3>
//                                             </div>
//                                             <div className="space-y-3">
//                                                 {dateGroup.slots.map((slot, slotIndex) => (
//                                                     <div 
//                                                         key={slotIndex}
//                                                         className={`rounded px-3 py-1 text-blue-800 ${
//                                                             (() => {
//                                                                 const [startTime, endTime] = slot.slotTime.split(' - ');
//                                                                 const parseTime = (timeStr) => {
//                                                                     if (!timeStr.includes(':') && !timeStr.includes('AM') && !timeStr.includes('PM')) {
//                                                                         timeStr += ' PM';
//                                                                     }
//                                                                     const [time, period] = timeStr.split(' ');
//                                                                     let [hours, minutes] = time.includes(':') ? time.split(':') : [time, '00'];
//                                                                     hours = parseInt(hours);
                                                                    
//                                                                     if (period === 'PM' && hours !== 12) {
//                                                                         hours += 12;
//                                                                     }
//                                                                     if (period === 'PM' && hours === 12) {
//                                                                         hours = 12;
//                                                                     }
//                                                                     if (period === 'AM' && hours === 12) {
//                                                                         hours = 0;
//                                                                     }
//                                                                     const slotDate = new Date(dateGroup.date);
//                                                                     slotDate.setHours(hours, parseInt(minutes), 0, 0);
//                                                                     return slotDate.getTime();
//                                                                 };
//                                                                 const slotStartTime = parseTime(startTime);
//                                                                 const currentTime = new Date().getTime();
//                                                                 const isSameDay = dateGroup.date === new Date().toISOString().split('T')[0];

//                                                                 return !slot.isBooked && isSameDay && slotStartTime < currentTime
//                                                                     ? 'bg-red-500' 
//                                                                     : slot.isBooked 
//                                                                         ? 'bg-green-500' 
//                                                                         : 'bg-blue-100'
//                                                             })()
//                                                         }`} >
//                                                         {slot.slotTime}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ));
//                             })()}
//                         </div>
//                     )}
//                 </div>



//                 <div className="flex items-center gap-6 mt-6 p-4 bg-white rounded-lg shadow-sm">
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 rounded-full bg-red-500"></div>
//                         <p className="text-sm text-gray-600">Time Expired</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 rounded-full bg-green-500"></div>
//                         <p className="text-sm text-gray-600">Booked Slots</p>
//                     </div>
//                 </div>

//                 {isOpen && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
//                         <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
//                             <div className="p-6 border-b border-gray-100">
//                                 <div className="flex justify-between items-center">
//                                     <h2 className="text-xl font-semibold text-gray-900">Schedule New Appointment</h2>
//                                     <button
//                                         onClick={handleClose}
//                                         className="text-gray-400 hover:text-gray-500 focus:outline-none"
//                                     >
//                                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                         </svg>
//                                     </button>     <button
//                                         onClick={handleClose}
//                                         className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
//                                     >
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="p-6">
//                             <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>

//                             <DatePicker
//                                 selected={selectedDate}
//                                 onChange={(date) => setSelectedDate(date)}
//                                 inline
//                                 minDate={today}
//                                 maxDate={maxDate}
//                             />

//                             {selectedDate && (
//                                 <div className="mt-4 grid grid-cols-2 gap-2">
//                                     {timeSlots.map((slot, index) => {
//                                         const isDisabled = isPastSlot(slot);
//                                         const isSelected = selectedTimeSlots[selectedDate.toDateString()]?.some(
//                                             (selectedSlot) => selectedSlot.label === slot.label
//                                         );

//                                         return (
//                                             <div
//                                                 key={index}
//                                                 className={`mb-2 p-2 border rounded 
//                                                     ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"} 
//                                                     ${isSelected ? "bg-green-500 text-white" : "bg-blue-100"}`}
//                                                 onClick={() => !isDisabled && handleTimeSlotClick(slot)}
//                                             >
//                                                 <div>
//                                                     <span
//                                                         className={`font-semibold 
//                                                             ${isDisabled ? "text-gray-500" : "text-blue-700"}
//                                                             ${isSelected ? "text-white" : ""}`}
//                                                     >
//                                                         {slot.label}
//                                                     </span>
//                                                     {isSelected && (
//                                                         <span className="ml-2 text-white text-sm">✓</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             )}

//                             <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
//                                 <button
//                                     onClick={handleClose}
//                                     className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleSchedule}
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                                 >
//                                     Confirm Schedule
//                                 </button>
//                             </div>
//                         </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Schedules;
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { schedule, exstingSchedules } from '../../../Services/doctorService/doctorService';

const Schedules = () => {
    const storedDoctorId = localStorage.getItem('doctorId');
    let doctorId;
    try {
        const parsedDoctorId = JSON.parse(storedDoctorId);
        doctorId = parsedDoctorId._id;
    } catch (error) {
        doctorId = storedDoctorId;
    }
    console.log("Doctor ID in Schedules:", doctorId);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
    const [existingSchedules, setExistingSchedules] = useState([]);
    console.log("Selected Time Slots:", selectedTimeSlots);

    const handleSchedule = async () => {
        console.log("Initial Selected Date:", selectedDate);
        console.log("Initial Selected Time Slots:", selectedTimeSlots);
        if (!selectedDate) {
            toast.error("Please select a date");
            return;
        }
        const selectedDateKey = selectedDate.toDateString();
        console.log("Selected Date Key:", selectedDateKey);

        if (!selectedTimeSlots[selectedDateKey] || selectedTimeSlots[selectedDateKey].length === 0) {
            toast.error("Please select a time slot");
            return;
        }
        setIsOpen(false);  
        try {
            const appointmentsData = Object.entries(selectedTimeSlots).flatMap(([date, slots]) => 
                slots.map(slot => {
                    console.log("Processing Slot:", slot);
                    console.log("Date:", date);

                    const [startTime, endTime] = slot.label.split(' - ');
                    console.log("Start Time:", startTime);

                    const appointmentDate = new Date(date);
                    const [hour, period] = startTime.split(' ');
                    const hourNum = parseInt(hour);
                    
                    const adjustedHour = period === 'PM' && hourNum !== 12 
                        ? hourNum + 12 
                        : (period === 'AM' && hourNum === 12 
                            ? 0 
                            : hourNum);
                    
                    appointmentDate.setHours(adjustedHour, 0, 0, 0);

                    const formattedAppointmentDate = appointmentDate.toISOString().split('T')[0];

                    return {
                        appointmentDate: formattedAppointmentDate,
                        slotTime: slot.label,
                        bookingTime: new Date()
                    };
                })
            );
            console.log("Prepared Appointments Data:", appointmentsData);
           
            const response = await schedule(doctorId, appointmentsData);

            console.log("Schedule Response:", response.data);
            
            const newSchedules = appointmentsData.map(appointment => ({
                appointmentDate: appointment.appointmentDate,
                slotTime: appointment.slotTime,
                isBooked: false
            }));
            
            setExistingSchedules(prevSchedules => [...prevSchedules, ...newSchedules]);
            
            setSelectedDate(null);
            setSelectedTimeSlots({});
            toast.success('Schedule submitted successfully!');
        } catch (error) {
            console.error('Schedule submission error:', error);
            console.error('Error Details:', error.response ? error.response.data : error.message);
            toast.error('Failed to submit schedule. Please try again.');
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedDate(null);
        setSelectedTimeSlots({});
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 2);

    const format12Hour = (hour) => {
        const suffix = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12; 
        return `${formattedHour} ${suffix}`;
    };

    const generateTimeSlots = () => {
        const slots = [];
        let startHour = 12; 
        let endHour = 19; 

        for (let hour = startHour; hour < endHour; hour++) {
            let startTime = new Date();
            startTime.setHours(hour, 0, 0, 0); 

            const label = `${format12Hour(hour)} - ${format12Hour(hour + 1)}`;
            slots.push({ label, time: startTime });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleTimeSlotClick = (slot) => {
        if (!selectedDate) return;

        const dateKey = selectedDate.toDateString();

        setSelectedTimeSlots((prev) => {
            const currentDateSlots = prev[dateKey] || [];
            const isSelected = currentDateSlots.some((selectedSlot) => selectedSlot.label === slot.label);
            console.log("Is Selected:", isSelected);
            if (isSelected) {
                return {
                    ...prev,
                    [dateKey]: currentDateSlots.filter((selectedSlot) => selectedSlot.label !== slot.label),
                };
            } else {
                return {
                    ...prev,
                    [dateKey]: [...currentDateSlots, slot],
                };
            }
        });
    };

    const isPastSlot = (slot) => {
        if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
            const now = new Date();
            now.setMinutes(0, 0, 0); 
            return slot.time <= now;
        }
        return false;
    };

    const fetchExistingSchedules = async () => {
        try {
            const response = await exstingSchedules(doctorId);
            setExistingSchedules(response.schedules || []);
            console.log("Existing Schedules:", response.schedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setExistingSchedules([]);
        }
    };

    useEffect(() => {
        fetchExistingSchedules();
    }, [doctorId]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activePage="Schedules" />
            <div className="flex-1 md:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Manage Schedules</h1>
                            <p className="mt-1 text-sm sm:text-base text-gray-600">Set your availability and manage time slots</p>
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Existing Schedules
                            </h2>
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                onClick={() => setIsOpen(true)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Schedule Appointment
                            </button>
                        </div>
                        {existingSchedules.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-lg">No schedules found</p>
                                <p className="text-gray-400 mt-2">Click the button above to create a new schedule</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(() => {
                                    const schedulesByDate = existingSchedules.reduce((acc, schedule) => {
                                        const dateKey = schedule.appointmentDate;
                                        if (!acc[dateKey]) {
                                            acc[dateKey] = {
                                                date: dateKey,
                                                slots: []
                                            };
                                        }
                                        acc[dateKey].slots.push(schedule);
                                        return acc;
                                    }, {});
                                    return Object.values(schedulesByDate)
                                        .map((dateGroup, index) => (
                                            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <h3 className="text-lg font-semibold text-gray-900">{dateGroup.date}</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    {dateGroup.slots.map((slot, slotIndex) => (
                                                        <div
                                                            key={slotIndex}
                                                            className={`rounded px-3 py-1 text-blue-800 ${
                                                                (() => {
                                                                    const [startTime] = slot.slotTime.split(' - ');
                                                                    const parseTime = (timeStr) => {
                                                                        if (!timeStr.includes(':') && !timeStr.includes('AM') && !timeStr.includes('PM')) {
                                                                            timeStr += ' PM';
                                                                        }
                                                                        const [time, period] = timeStr.split(' ');
                                                                        let [hours, minutes] = time.includes(':') ? time.split(':') : [time, '00'];
                                                                        hours = parseInt(hours);
                                                                        
                                                                        if (period === 'PM' && hours !== 12) hours += 12;
                                                                        if (period === 'PM' && hours === 12) hours = 12;
                                                                        if (period === 'AM' && hours === 12) hours = 0;
                                                                        const slotDate = new Date(dateGroup.date);
                                                                        slotDate.setHours(hours, parseInt(minutes), 0, 0);
                                                                        return slotDate.getTime();
                                                                    };
                                                                    const slotStartTime = parseTime(startTime);
                                                                    const currentTime = new Date().getTime();
                                                                    const isSameDay = dateGroup.date === new Date().toISOString().split('T')[0];

                                                                    return !slot.isBooked && isSameDay && slotStartTime < currentTime
                                                                        ? 'bg-red-500'
                                                                        : slot.isBooked
                                                                            ? 'bg-green-500'
                                                                            : 'bg-blue-100';
                                                                })()
                                                            }`}
                                                        >
                                                            {slot.slotTime}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ));
                                })()}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 mt-6 p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <p className="text-sm text-gray-600">Time Expired</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <p className="text-sm text-gray-600">Booked Slots</p>
                        </div>
                    </div>

                    {isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-900">Schedule New Appointment</h2>
                                        <button
                                            onClick={handleClose}
                                            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>

                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        inline
                                        minDate={today}
                                        maxDate={maxDate}
                                    />

                                    {selectedDate && (
                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            {timeSlots.map((slot, index) => {
                                                const isDisabled = isPastSlot(slot);
                                                const isSelected = selectedTimeSlots[selectedDate.toDateString()]?.some(
                                                    (selectedSlot) => selectedSlot.label === slot.label
                                                );

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`mb-2 p-2 border rounded 
                                                            ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"} 
                                                            ${isSelected ? "bg-green-500 text-white" : "bg-blue-100"}`}
                                                        onClick={() => !isDisabled && handleTimeSlotClick(slot)}
                                                    >
                                                        <div>
                                                            <span
                                                                className={`font-semibold 
                                                                    ${isDisabled ? "text-gray-500" : "text-blue-700"}
                                                                    ${isSelected ? "text-white" : ""}`}
                                                            >
                                                                {slot.label}
                                                            </span>
                                                            {isSelected && (
                                                                <span className="ml-2 text-white text-sm">✓</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSchedule}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                        >
                                            Confirm Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schedules;