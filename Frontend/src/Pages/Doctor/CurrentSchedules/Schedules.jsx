import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';

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
            const response = await axios.post(`http://localhost:5000/api/doctor/schedule/${doctorId}`, {
                appointments: appointmentsData
            });
            console.log("Schedule Response:", response.data);
            
            // Immediately update the existingSchedules state with the new appointments
            const newSchedules = appointmentsData.map(appointment => ({
                appointmentDate: appointment.appointmentDate,
                slotTime: appointment.slotTime,
                isBooked: false
            }));
            
            setExistingSchedules(prevSchedules => [...prevSchedules, ...newSchedules]);
            
            // Reset selected date and time slots
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
        const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${formattedHour} ${suffix}`;
    };

    const generateTimeSlots = () => {
        const slots = [];
        let startHour = 12; // 5 PM
        let endHour = 19; // 12 AM

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
            now.setMinutes(0, 0, 0); // Ignore minutes and seconds
            return slot.time <= now;
        }
        return false;
    };

    const fetchExistingSchedules = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/doctor/existing-schedules/${doctorId}`);
            setExistingSchedules(response.data.schedules || []);

            console.log("Existing Schedules:", response.data.schedules);
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
            <div className="ml-64 flex-1 p-8 mt-4">
                <h1 className="text-2xl font-bold mb-5">Current Schedules</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Existing Schedules</h2>
                    {existingSchedules.length === 0 ? (
                        <p className="text-gray-500">No schedules found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(() => {
                                const schedulesByDate = existingSchedules.reduce((acc, schedule) => {
                                    const dateKey = schedule.appointmentDate; // Use the date directly from the schedule

                                    if (!acc[dateKey]) {
                                        acc[dateKey] = {
                                            date: dateKey,
                                            slots: []
                                        };
                                    }
                                    acc[dateKey].slots.push(schedule); // Store the entire schedule object
                                    return acc;
                                }, {});
                                return Object.values(schedulesByDate)
                                    .map((dateGroup, index) => (
                                        <div key={index} className="border rounded-lg p-4 shadow-sm">
                                            <h3 className="font-bold mb-2">{dateGroup.date}</h3> {/* Directly use the date */}
                                            <div className="space-y-2">
                                                {dateGroup.slots.map((slot, slotIndex) => (
                                                    <div 
                                                        key={slotIndex}
                                                        className={`rounded px-3 py-1 text-blue-800 ${
                                                            (() => {
                                                                const [startTime, endTime] = slot.slotTime.split(' - ');
                                                                const parseTime = (timeStr) => {
                                                                    if (!timeStr.includes(':') && !timeStr.includes('AM') && !timeStr.includes('PM')) {
                                                                        timeStr += ' PM';
                                                                    }
                                                                    const [time, period] = timeStr.split(' ');
                                                                    let [hours, minutes] = time.includes(':') ? time.split(':') : [time, '00'];
                                                                    hours = parseInt(hours);
                                                                    
                                                                    if (period === 'PM' && hours !== 12) {
                                                                        hours += 12;
                                                                    }
                                                                    if (period === 'PM' && hours === 12) {
                                                                        hours = 12;
                                                                    }
                                                                    // Handle 12 AM (midnight)
                                                                    if (period === 'AM' && hours === 12) {
                                                                        hours = 0;
                                                                    }
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
                                                                        : 'bg-blue-100'
                                                            })()
                                                        }`} >
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

                <button
                    className="absolute top-5 right-5 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsOpen(true)}
                >
                    Schedule Appointment
                </button>

                <div className="status-container" style={{marginTop:'10px'}}>
                    <div className="w-3 h-3 bg-red-500"></div>
                    <p>Time Expired</p>
                    <div className='w-3 h-3 bg-green-500'></div>
                    <p>Booked Slots</p>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
                                    onClick={handleSchedule}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Confirm Schedule
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