// import React, { useEffect, useState } from 'react';
// import Sidebar from '../../../Component/Doctor/Sidebar';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const Schedules = () => {
//     const storedDoctorId = localStorage.getItem('doctorId');
//     // If you stored the entire object as a JSON string
//     let doctorId;
//     try {
//         const parsedDoctorId = JSON.parse(storedDoctorId);
//         doctorId = parsedDoctorId._id ;
//     } catch (error) {
//         // If it's a simple string ID
//         doctorId = storedDoctorId;
//     }
//     console.log("Doctor ID in Schedules:", doctorId);
//     // Verify the type and value
//     console.log("Doctor ID value:", doctorId);

//     const [isOpen, setIsOpen] = useState(false);
//     // const [confirm, setConfirm] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedTimeSlots, setSelectedTimeSlots] = useState({}); // Keep track of selected slots for each date
//     const [existingSchedules, setExistingSchedules] = useState([]);
//    console.log("Selected Time Slots:", selectedTimeSlots);
//     const handleSchedule = async () => {
//         console.log("Initial Selected Date:", selectedDate);
//         console.log("Initial Selected Time Slots:", selectedTimeSlots);

//         if (!selectedDate) {
//             alert("Please select a date");
//             return;
//         }

//         const selectedDateKey = selectedDate.toDateString();
//         console.log("Selected Date Key:", selectedDateKey);

//         if (!selectedTimeSlots[selectedDateKey] || selectedTimeSlots[selectedDateKey].length === 0) {
//             alert("Please select a time slot");
//             return;
//         }

//         setIsOpen(false);
        
//         try {
//             // Prepare appointments data using the selected date and time slots
//             const appointmentsData = Object.entries(selectedTimeSlots).flatMap(([date, slots]) => 
//                 slots.map(slot => {
//                     console.log("Processing Slot:", slot);
//                     console.log("Date:", date);

//                     // Create a new Date object with the selected date and time
//                     const [startTime, endTime] = slot.label.split(' - ');
//                     console.log("Start Time:", startTime);

//                     const appointmentDate = new Date(date);
//                     const [hour, period] = startTime.split(' ');
//                     const hourNum = parseInt(hour);
                    
//                     // Adjust hour based on AM/PM
//                     const adjustedHour = period === 'PM' && hourNum !== 12 
//                         ? hourNum + 12 
//                         : (period === 'AM' && hourNum === 12 
//                             ? 0 
//                             : hourNum);
                    
//                     appointmentDate.setHours(adjustedHour, 0, 0, 0);

//                     console.log("Adjusted Appointment Date:", appointmentDate);

//                     return {
//                         appointmentDate: appointmentDate,
//                         slotTime: slot.label,
//                         bookingTime: new Date() // Current timestamp for booking
//                     };
//                 })
//             );

//             console.log("Prepared Appointments Data:", appointmentsData);

//             const response = await axios.post(`http://localhost:5000/api/doctor/schedule/${doctorId}`, {
//                 appointments: appointmentsData
//             });

//             console.log("Schedule Response:", response.data);

//             // Update existing schedules after successful submission
//             setExistingSchedules(response.data.schedule.appointments);

//             // Reset selected date and time slots
//             setSelectedDate(null);
//             setSelectedTimeSlots({});

//             alert('Schedule submitted successfully!');
//         } catch (error) {
//             console.error('Schedule submission error:', error);
//             console.error('Error Details:', error.response ? error.response.data : error.message);
//             alert('Failed to submit schedule. Please try again.');
//         }
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setSelectedDate(null);
//         setSelectedTimeSlots({});
//     }
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const maxDate = new Date(today);
//     maxDate.setDate(maxDate.getDate() + 2);

//     const format12Hour = (hour) => {
//         const suffix = hour >= 12 ? "PM" : "AM";
//         const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
//         return `${formattedHour} ${suffix}`;
//     };

//     const generateTimeSlots = () => {
//         const slots = [];
//         let startHour = 17; // 5 PM
//         let endHour = 24; // 12 AM

//         for (let hour = startHour; hour < endHour; hour++) {
//             let startTime = new Date();
//             startTime.setHours(hour, 0, 0, 0); // Set hours & reset minutes

//             const label = `${format12Hour(hour)} - ${format12Hour(hour + 1)}`;
//             slots.push({ label, time: startTime });
//         }
//         return slots;
//     };

//     const timeSlots = generateTimeSlots();

//     const handleTimeSlotClick = (slot) => {
//         if (!selectedDate) return;

//         // Get the date key for the selected date
//         const dateKey = selectedDate.toDateString();

//         // Update selected time slots for the selected date
//         setSelectedTimeSlots((prev) => {
//             const currentDateSlots = prev[dateKey] || [];
//             const isSelected = currentDateSlots.some((selectedSlot) => selectedSlot.label === slot.label);
//             console.log("Is Selected:", isSelected);
//             if (isSelected) {
//                 // Deselect the slot if it's already selected
//                 return {
//                     ...prev,
//                     [dateKey]: currentDateSlots.filter((selectedSlot) => selectedSlot.label !== slot.label),
//                 };
//             } else {
//                 // Select the slot if it's not already selected
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
//             now.setMinutes(0, 0, 0); // Ignore minutes and seconds
//             return slot.time <= now;
//         }
//         return false;
//     };

//     useEffect(() => {
//         const fetchExistingSchedules = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/doctor/existing-schedules/${doctorId}`);
//                 // Directly use the schedules from the response
//                 setExistingSchedules(response.data.schedules || []);
//                 console.log("Existing Schedules:", response.data.schedules);
//             } catch (error) {
//                 console.error('Error fetching schedules:', error);
//                 setExistingSchedules([]);
//             }
//         };

//         fetchExistingSchedules();
//     }, [doctorId]);

//     return (
//         <div className="flex">
//             <Sidebar activePage="Schedules" />

//             <div className="relative w-full p-5 box-border">
//                 <h1 className="text-center text-2xl font-bold mb-5">Current Schedules</h1>

//                 {/* Existing Schedules Display */}
//                 <div className="mb-6">
//                     <h2 className="text-xl font-semibold mb-3">Existing Schedules</h2>
//                     {existingSchedules.length === 0 ? (
//                         <p className="text-gray-500">No schedules found</p>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {(() => {
//                                 // Group schedules by date with original date for sorting
//                                 const schedulesByDate = existingSchedules.reduce((acc, schedule) => {
//                                     const appointmentDate = new Date(schedule.appointmentDate);
//                                     const dateKey = appointmentDate.toLocaleDateString('en-US', {
//                                         year: 'numeric',
//                                         month: 'long',
//                                         day: 'numeric'
//                                     });

//                                     if (!acc[dateKey]) {
//                                         acc[dateKey] = {
//                                             originalDate: appointmentDate,
//                                             date: dateKey,
//                                             slots: []
//                                         };
//                                     }

//                                     acc[dateKey].slots.push(schedule.slotTime);
//                                     return acc;
//                                 }, {});

//                                 // Convert to array, sort chronologically, and render
//                                 return Object.values(schedulesByDate)
//                                     .sort((a, b) => a.originalDate - b.originalDate)
//                                     .map((dateGroup, index) => (
//                                         <div key={index} className="border rounded-lg p-4 shadow-sm">
//                                             <h3 className="font-bold mb-2">{dateGroup.date}</h3>
//                                             <div className="space-y-2">
//                                                 {dateGroup.slots.map((slot, slotIndex) => (
//                                                     <div 
//                                                         key={slotIndex}
//                                                         className="bg-blue-100 rounded px-3 py-1 text-blue-800"
//                                                     >
//                                                         {slot}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ));
//                             })()}
//                         </div>
//                     )}
//                 </div>

//                 <button
//                     className="absolute top-5 right-5 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//                     onClick={() => setIsOpen(true)}
//                 >
//                     Schedule Appointment
//                 </button>

//                 {isOpen && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                         <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                             <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>

//                             {/* Date Picker */}
//                             <DatePicker
//                                 selected={selectedDate}
//                                 onChange={(date) => setSelectedDate(date)}
//                                 inline
//                                 minDate={today}
//                                 maxDate={maxDate}
//                             />

//                             {/* Time Slots (Only Show After Date Selection) */}
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

//                             {/* Close Button */}
//                             <div className="mt-4 flex justify-end">
//                                 <button
//                                     onClick={handleClose}
//                                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                             <div className="mt-4 flex justify-start">
//                                 <button
//                                     // onClick={() => setIsOpen(false)}
//                                     onClick={handleSchedule}
//                                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                                 >
//                                     Confrim Schedule
//                                 </button>
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
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Schedules = () => {
    const storedDoctorId = localStorage.getItem('doctorId');
    // If you stored the entire object as a JSON string
    let doctorId;
    try {
        const parsedDoctorId = JSON.parse(storedDoctorId);
        doctorId = parsedDoctorId._id;
    } catch (error) {
        // If it's a simple string ID
        doctorId = storedDoctorId;
    }
    console.log("Doctor ID in Schedules:", doctorId);
    // Verify the type and value
    console.log("Doctor ID value:", doctorId);

    const [isOpen, setIsOpen] = useState(false);
    // const [confirm, setConfirm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState({}); // Keep track of selected slots for each date
    const [existingSchedules, setExistingSchedules] = useState([]);
    console.log("Selected Time Slots:", selectedTimeSlots);

    const handleSchedule = async () => {
        console.log("Initial Selected Date:", selectedDate);
        console.log("Initial Selected Time Slots:", selectedTimeSlots);

        if (!selectedDate) {
            alert("Please select a date");
            return;
        }

        const selectedDateKey = selectedDate.toDateString();
        console.log("Selected Date Key:", selectedDateKey);

        if (!selectedTimeSlots[selectedDateKey] || selectedTimeSlots[selectedDateKey].length === 0) {
            alert("Please select a time slot");
            return;
        }

        setIsOpen(false);
        
        try {
            // Prepare appointments data using the selected date and time slots
            const appointmentsData = Object.entries(selectedTimeSlots).flatMap(([date, slots]) => 
                slots.map(slot => {
                    console.log("Processing Slot:", slot);
                    console.log("Date:", date);

                    // Create a new Date object with the selected date and time
                    const [startTime, endTime] = slot.label.split(' - ');
                    console.log("Start Time:", startTime);

                    const appointmentDate = new Date(date);
                    const [hour, period] = startTime.split(' ');
                    const hourNum = parseInt(hour);
                    
                    // Adjust hour based on AM/PM
                    const adjustedHour = period === 'PM' && hourNum !== 12 
                        ? hourNum + 12 
                        : (period === 'AM' && hourNum === 12 
                            ? 0 
                            : hourNum);
                    
                    appointmentDate.setHours(adjustedHour, 0, 0, 0);

                    console.log("Adjusted Appointment Date:", appointmentDate);

                    return {
                        appointmentDate: appointmentDate,
                        slotTime: slot.label,
                        bookingTime: new Date() // Current timestamp for booking
                    };
                })
            );

            console.log("Prepared Appointments Data:", appointmentsData);

            const response = await axios.post(`http://localhost:5000/api/doctor/schedule/${doctorId}`, {
                appointments: appointmentsData
            });

            console.log("Schedule Response:", response.data);

            // Update existing schedules after successful submission
            setExistingSchedules(response.data.schedule.appointments);

            // Reset selected date and time slots
            setSelectedDate(null);
            setSelectedTimeSlots({});

            alert('Schedule submitted successfully!');
        } catch (error) {
            console.error('Schedule submission error:', error);
            console.error('Error Details:', error.response ? error.response.data : error.message);
            alert('Failed to submit schedule. Please try again.');
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
        const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${formattedHour} ${suffix}`;
    };

    const generateTimeSlots = () => {
        const slots = [];
        let startHour = 17; // 5 PM
        let endHour = 24; // 12 AM

        for (let hour = startHour; hour < endHour; hour++) {
            let startTime = new Date();
            startTime.setHours(hour, 0, 0, 0); // Set hours & reset minutes

            const label = `${format12Hour(hour)} - ${format12Hour(hour + 1)}`;
            slots.push({ label, time: startTime });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleTimeSlotClick = (slot) => {
        if (!selectedDate) return;

        // Get the date key for the selected date
        const dateKey = selectedDate.toDateString();

        // Update selected time slots for the selected date
        setSelectedTimeSlots((prev) => {
            const currentDateSlots = prev[dateKey] || [];
            const isSelected = currentDateSlots.some((selectedSlot) => selectedSlot.label === slot.label);
            console.log("Is Selected:", isSelected);
            if (isSelected) {
                // Deselect the slot if it's already selected
                return {
                    ...prev,
                    [dateKey]: currentDateSlots.filter((selectedSlot) => selectedSlot.label !== slot.label),
                };
            } else {
                // Select the slot if it's not already selected
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
            now.setMinutes(0, 0, 0); // Ignore minutes and seconds
            return slot.time <= now;
        }
        return false;
    };

    useEffect(() => {
        const fetchExistingSchedules = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctor/existing-schedules/${doctorId}`);
                // Directly use the schedules from the response
                setExistingSchedules(response.data.schedules || []);
                console.log("Existing Schedules:", response.data.schedules);
            } catch (error) {
                console.error('Error fetching schedules:', error);
                setExistingSchedules([]);
            }
        };

        fetchExistingSchedules();
    }, [doctorId]);

    return (
        <div className="flex">
            <Sidebar activePage="Schedules" />

            <div className="relative w-full p-5 box-border">
                <h1 className="text-center text-2xl font-bold mb-5">Current Schedules</h1>

                {/* Existing Schedules Display */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Existing Schedules</h2>
                    {existingSchedules.length === 0 ? (
                        <p className="text-gray-500">No schedules found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(() => {
                                // Group schedules by date with original date for sorting
                                const schedulesByDate = existingSchedules.reduce((acc, schedule) => {
                                    const appointmentDate = new Date(schedule.appointmentDate);
                                    const dateKey = appointmentDate.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    });

                                    if (!acc[dateKey]) {
                                        acc[dateKey] = {
                                            originalDate: appointmentDate,
                                            date: dateKey,
                                            slots: []
                                        };
                                    }

                                    acc[dateKey].slots.push(schedule.slotTime);
                                    return acc;
                                }, {});

                                // Convert to array, sort chronologically, and render
                                return Object.values(schedulesByDate)
                                    .sort((a, b) => a.originalDate - b.originalDate)
                                    .map((dateGroup, index) => (
                                        <div key={index} className="border rounded-lg p-4 shadow-sm">
                                            <h3 className="font-bold mb-2">{dateGroup.date}</h3>
                                            <div className="space-y-2">
                                                {dateGroup.slots.map((slot, slotIndex) => (
                                                    <div 
                                                        key={slotIndex}
                                                        className="bg-blue-100 rounded px-3 py-1 text-blue-800"
                                                    >
                                                        {slot}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ));
                            })()}
                        </div>
                    )}
                </div>

                <button
                    className="absolute top-5 right-5 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsOpen(true)}
                >
                    Schedule Appointment
                </button>

                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>

                            {/* Date Picker */}
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                inline
                                minDate={today}
                                maxDate={maxDate}
                            />

                            {/* Time Slots (Only Show After Date Selection) */}
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

                            {/* Close Button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="mt-4 flex justify-start">
                                <button
                                    // onClick={() => setIsOpen(false)}
                                    onClick={handleSchedule}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Confrim Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedules;
