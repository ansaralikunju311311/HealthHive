// import React, { useState, useEffect } from 'react';
// import NavBar from '../../../Common/NavBar';
// import { useLocation } from 'react-router-dom';
// import Footer from '../../../Common/Footer';
// import axios from 'axios';

// const Slot = () => {
//     const location = useLocation();
//     const doctorData = location.state?.doctor;

//     const userItem = localStorage.getItem('userId');
//     const userId = userItem ? JSON.parse(userItem)._id : null;

//     const [schedules, setSchedules] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedSlots, setSelectedSlots] = useState([]);

//     const fetchDoctorSchedules = async () => {
//         if (!doctorData || !doctorData._id) {
//             console.error('No doctor selected or invalid doctor data');
//             setError('No doctor selected');
//             setLoading(false);
//             return;
//         }

//         try {
//             setLoading(true);
//             console.log(`Fetching slots for doctor ID: ${doctorData._id}`);

//             const response = await axios.get(`http://localhost:5000/api/doctor/slots/${doctorData._id}`);
//             // console.log('Full API Response:', JSON.stringify(response.data, null, 2));


//             console.log("=====================dara",response.data)

//             // Access the appointments array from the schedules object
//             if (response.data && response.data.schedules && Array.isArray(response.data.schedules)) {
//                 console.log('Schedules:', response.data.schedules);
//                 setSchedules(response.data.schedules);
//                 if (response.data.schedules.length === 0) {
//                     console.log('No available slots for this doctor');
//                     setError('No available slots for this doctor');
//                 }
//             } else {
//                 setError('No schedules found');
//                 setSchedules([]); // Ensure it's an empty array
//             }
//         } catch (err) {
//             console.error('Error fetching slots:', err);
//             setError(err.response?.data.message || 'Failed to fetch slots');
//             setSchedules([]); // Reset schedules on error
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchDoctorSchedules();
//     }, [doctorData?._id]);

//     const handleSlotSelection = (schedule, slot) => {
//         if (slot.isBooked) {
//             alert('This slot is already booked');
//             return;
//         }

//         const isAlreadySelected = selectedSlots.some(
//             selectedSlot => 
//                 selectedSlot.schedule.date === schedule.appointmentDate && 
//                 selectedSlot.slot.label === slot.slotTime
//         );

//         if (isAlreadySelected) {
//             setSelectedSlots(prevSlots => 
//                 prevSlots.filter(
//                     selectedSlot => 
//                         !(selectedSlot.schedule.date === schedule.appointmentDate && 
//                           selectedSlot.slot.label === slot.slotTime)
//                 )
//             );
//         } else {
//             setSelectedSlots(prevSlots => [
//                 ...prevSlots, 
//                 { schedule, slot }
//             ]);
//         }
//     };

//     const handleBookAppointment = async () => {
//         if (selectedSlots.length === 0) {
//             alert('Please select at least one slot');
//             return;
//         }

//         try {
//           console.log("selectedSlots",selectedSlots);
          
//           // console.log("selectedSlots",selectedSlots.schedule.appointmentDate);
//             const response = await axios.post(
//                 `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId}`, 
//                 { 
//                     slots: selectedSlots.map(selectedSlot => ({
                    
//                         date: selectedSlot.schedule.appointmentDate,
                        
//                         // slot: selectedSlot.slot.label,
//                         time: selectedSlot.schedule.slotTime // Add time if needed
//                     }))
//                 }
//             );

//             console.log('Appointments booked successfully', response.data);
//             fetchDoctorSchedules();
//             setSelectedSlots([]);
//             alert('Appointments booked successfully');
//         } catch (error) {
//             console.error('Error booking appointments:', error);
//             alert(error.response?.data?.message || 'Error booking appointments');
//         }
//     };

//     const renderContent = () => {
//         if (loading) {
//             return <div>Loading...</div>;
//         }

//         if (error) {
//             console.error('Error fetching schedules:', error);
//             return <div>Error: {error}</div>;
//         }

//         // Ensure schedules is an array before mapping
//         if (!Array.isArray(schedules)) {
//             console.error('Schedules is not an array:', schedules);
//             return <div>No available slots for this doctor</div>;
//         }

//         if (schedules.length === 0) {
//             return <div>No available slots for this doctor</div>;
//         }

//         return (
//             <div>
//                 <h2>Available Slots:</h2>
//                 {schedules.map((schedule, index) => (
//                     <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4">
//                         <h3 className="text-xl font-semibold mb-4">
//                             Date: {new Date(schedule.appointmentDate).toLocaleDateString('en-US', {
//                                 weekday: 'long', 
//                                 year: 'numeric', 
//                                 month: 'long', 
//                                 day: 'numeric'
//                             })}
//                         </h3>
//                         <div className="grid grid-cols-3 gap-4"  >
//                             <button
//                                 onClick={() => handleSlotSelection(schedule, {
//                                     appointmentDate: schedule.appointmentDate,
//                                     slotTime: schedule.slotTime,
//                                     // isBooked: false // Adjust based on your logic
//                                 })}
//                                 className={`p-3 rounded-lg bg-blue-100 ${schedule.isBooked && 'bg-green-500 cursor-not-allowed'}`}>
//                                 {schedule.slotTime}
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//                 {selectedSlots.length > 0 && (
//                     <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 shadow-lg flex justify-between items-center">
//                         <p className="text-center flex-grow">
//                             Selected Slots: {selectedSlots.map(slot => 
//                                 `${new Date(slot.schedule.appointmentDate).toLocaleDateString()} at ${slot.schedule.slotTime}`
//                             ).join(', ')}
//                         </p>
//                         <button 
//                             onClick={handleBookAppointment}
//                             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                         >
//                             Book Appointments
//                         </button>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <NavBar />
//             <div className="container mx-auto px-4 py-8">
//                 {renderContent()}
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default Slot;
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
                                    className={`p-3 rounded-lg bg-blue-100 ${slot.isBooked && 'bg-green-500 cursor-not-allowed'}`}>
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