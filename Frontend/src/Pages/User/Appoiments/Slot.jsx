import React, { useState, useEffect } from 'react';
import NavBar from '../../../Common/NavBar';
import { useLocation } from 'react-router-dom';
import Footer from '../../../Common/Footer';
import axios from 'axios';

const Slot = () => {
    const location = useLocation();
    const doctorData = location.state?.doctor;

    const userItem = localStorage.getItem('userId');
    const userId = userItem ? JSON.parse(userItem)._id : null;

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);

    const fetchDoctorSchedules = async () => {
        if (!doctorData || !doctorData._id) {
            setError('No doctor selected');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/doctor/slots/${doctorData._id}`);
            if (response.data && Array.isArray(response.data.schedules)) {
                setSchedules(response.data.schedules);
                if (response.data.schedules.length === 0) {
                    setError('No available slots for this doctor');
                }
            } else {
                setError('No schedules found');
                setSchedules([]);
            }
        } catch (err) {
            setError(err.response?.data.message || 'Failed to fetch slots');
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorSchedules();
    }, [doctorData?._id]);

    const handleSlotSelection = (schedule, slot) => {
        if (slot.isBooked) {
            alert('This slot is already booked');
            return;
        }

        const isAlreadySelected = selectedSlots.some(
            selectedSlot => 
                selectedSlot.schedule.date === schedule.appointmentDate && 
                selectedSlot.slot.label === slot.slotTime
        );

        if (isAlreadySelected) {
            setSelectedSlots(prevSlots => 
                prevSlots.filter(
                    selectedSlot => 
                        !(selectedSlot.schedule.date === schedule.appointmentDate && 
                          selectedSlot.slot.label === slot.slotTime)
                )
            );
        } else {
            setSelectedSlots(prevSlots => [
                ...prevSlots, 
                { schedule, slot }
            ]);
        }
    };

    const handleBookAppointment = async () => {
        if (selectedSlots.length === 0) {
            alert('Please select at least one slot');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId}`, 
                { 
                    slots: selectedSlots.map(selectedSlot => ({
                        date: selectedSlot.schedule.appointmentDate,
                        time: selectedSlot.schedule.slotTime
                    }))
                }
            );

            alert('Appointments booked successfully');
            fetchDoctorSchedules();
            setSelectedSlots([]);
        } catch (error) {
            alert(error.response?.data?.message || 'Error booking appointments');
        }
    };

    const parseTime = (timeStr, date) => {
        // Add PM if not present and no colon
        if (!timeStr.includes(':') && !timeStr.includes('AM') && !timeStr.includes('PM')) {
            timeStr += ' PM';
        }

        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.includes(':') ? time.split(':') : [time, '00'];
        hours = parseInt(hours);
        
        // Adjust hours for PM
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }
        // Handle 12 PM (noon)
        if (period === 'PM' && hours === 12) {
            hours = 12;
        }
        // Handle 12 AM (midnight)
        if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return new Date(date).setHours(hours, parseInt(minutes), 0, 0);
    };

    const isSlotExpired = (slotData, appointmentDate) => {
        const isSameDay = appointmentDate === new Date().toISOString().split('T')[0];
        const slotStartTime = parseTime(slotData.slotTime, appointmentDate);
        return isSameDay && !slotData.isBooked && slotStartTime < new Date();
    };

    const renderContent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (!Array.isArray(schedules) || schedules.length === 0) {
            return <div>No available slots for this doctor</div>;
        }

        // Group schedules by appointment date
        const groupedSchedules = schedules.reduce((acc, schedule) => {
            const date = schedule.appointmentDate; // Assuming this is in a format you can use directly
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(schedule);
            return acc;
        }, {});

        return (
            <div>
                <h2>Available Slots:</h2>
                {Object.keys(groupedSchedules).map(date => (
                    <div key={date} className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <h3 className="text-xl font-semibold mb-4">
                            Date: {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            })}
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {groupedSchedules[date].map((slot, slotIndex) => (
                                <button
                                    key={slotIndex}
                                    onClick={() => handleSlotSelection(slot, {
                                        appointmentDate: slot.appointmentDate,
                                        slotTime: slot.slotTime,
                                    })}
                                    className={`p-3 rounded-lg ${slot.isBooked ? 'bg-green-500 cursor-not-allowed' : isSlotExpired(slot, slot.appointmentDate) ? 'bg-red-500 cursor-not-allowed' : 'bg-blue-100'}`}>
                                    {slot.slotTime}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {selectedSlots.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 shadow-lg flex justify-between items-center">
                        <p className="text-center flex-grow">
                            Selected Slots: {selectedSlots.map(slot => 
                                `${new Date(slot.schedule.appointmentDate).toLocaleDateString()} at ${slot.schedule.slotTime}`
                            ).join(', ')}
                        </p>
                        <button 
                            onClick={handleBookAppointment}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Book Appointments
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                {renderContent()}
            </div>
            <Footer />
        </div>
    );
};

export default Slot;