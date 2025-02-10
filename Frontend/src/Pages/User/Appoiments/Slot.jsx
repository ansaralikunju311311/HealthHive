// import React, { useState, useEffect } from 'react';
// import NavBar from '../../../Common/NavBar';
// import { useLocation } from 'react-router-dom';
// import Footer from '../../../Common/Footer';
// import axios from 'axios';

// const Slot = () => {
//   const location = useLocation();
//   const doctorData = location.state?.doctor;
  
//   const userItem = localStorage.getItem('userId');
//   const userId = userItem ? JSON.parse(userItem)._id : null;
//   console.log('userid=====',userId);
  
//   const [schedules, setSchedules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSlots, setSelectedSlots] = useState([]);

//   const fetchDoctorSchedules = async () => {
//     // Validate doctor data
//     if (!doctorData || !doctorData._id) {
//       console.error('No doctor selected or invalid doctor data');
//       setError('No doctor selected');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log(`Fetching slots for doctor ID: ${doctorData._id}`);
      
//       const response = await axios.get(`http://localhost:5000/api/doctor/slots/${doctorData._id}`);
      
//       console.log('Full Slots Response:', JSON.stringify(response.data, null, 2));

//       if (response.data && response.data.schedules) {
//         setSchedules(response.data.schedules);
//         if (response.data.schedules.length === 0) {
//           setError('No available slots for this doctor');
//         }
//       } else {
//         setError('No schedules found');
//         setSchedules([]);
//       }
//     } catch (err) {
//       console.error('Error fetching slots:', err);
      
//       // More detailed error handling
//       if (err.response) {
//         setError(err.response.data.message || 'Failed to fetch slots');
//       } else if (err.request) {
//         setError('No response received from server');
//       } else {
//         setError('Error setting up the request');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctorSchedules();
//   }, [doctorData?._id]);

//   const handleSlotSelection = (schedule, slot) => {
//     // Check if slot is already booked
//     if (slot.isBooked) {
//       alert('This slot is already booked');
//       return;
//     }

//     // Check if slot is already selected
//     const isAlreadySelected = selectedSlots.some(
//       selectedSlot => 
//         selectedSlot.schedule.date === schedule.date && 
//         selectedSlot.slot.label === slot.label
//     );

//     if (isAlreadySelected) {
//       // If already selected, remove from selected slots
//       setSelectedSlots(prevSlots => 
//         prevSlots.filter(
//           selectedSlot => 
//             !(selectedSlot.schedule.date === schedule.date && 
//               selectedSlot.slot.label === slot.label)
//         )
//       );
//     } else {
//       // Add to selected slots
//       setSelectedSlots(prevSlots => [
//         ...prevSlots, 
//         { schedule, slot }
//       ]);
//     }
//   };

//   const handleBookAppointment = async () => {
//     if (selectedSlots.length === 0) {
//       alert('Please select at least one slot');
//       return;
//     }

//     try {
//       // Send all selected slots to the backend
//       const response = await axios.post(
//         `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId}`, 
//         { 
//           slots: selectedSlots.map(selectedSlot => ({
//             date: selectedSlot.schedule.date,
//             slot: selectedSlot.slot.label,
//             time: selectedSlot.slot.time // Add time if needed
//           }))
//         }
//       );
      
//       console.log('Appointments booked successfully', response.data);
      
//       // Refresh slots to update booked status
//       fetchDoctorSchedules();
      
//       // Reset selected slots
//       setSelectedSlots([]);
      
//       // Show success message
//       alert('Appointments booked successfully');
//     } catch (error) {
//       console.error('Error booking appointments:', error);
      
//       // Show specific error message from backend
//       alert(error.response?.data?.message || 'Error booking appointments');
//     }
//   };

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
//           <p className="ml-4">Loading schedules...</p>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       );
//     }

//     if (schedules.length === 0) {
//       return (
//         <div className="text-center text-gray-500 py-8">
//           <p>No available slots for this doctor</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           Available Slots for Dr. {doctorData.name}
//         </h2>
//         {schedules.map((schedule, scheduleIndex) => (
//           <div 
//             key={scheduleIndex} 
//             className="bg-white shadow-md rounded-lg p-6 mb-4"
//           >
//             <h3 className="text-xl font-semibold mb-4">
//               Date: {new Date(schedule.date).toLocaleDateString('en-US', {
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric'
//               })}
//             </h3>
//             <div className="grid grid-cols-3 gap-4">
//               {schedule.timeSlots.map((slot, slotIndex) => (
//                 <button
//                   key={slotIndex}
//                   onClick={() => handleSlotSelection(schedule, slot)}
//                   className={`
//                     p-3 rounded-lg transition-all duration-300 
//                     ${slot.isBooked 
//                       ? 'bg-red-200 text-red-800 cursor-not-allowed' 
//                       : 'bg-green-200 text-green-800 hover:bg-green-300 hover:scale-105'}
//                     ${selectedSlots.some(
//                       selectedSlot => 
//                         selectedSlot.schedule.date === schedule.date && 
//                         selectedSlot.slot.label === slot.label
//                     ) 
//                       ? 'ring-4 ring-blue-500' 
//                       : ''}
//                   `}
//                   disabled={slot.isBooked}
//                 >
//                   <div className="flex flex-col items-center">
//                     <span className="font-semibold">{slot.label}</span>
//                     <span className="text-sm">
//                       {new Date(slot.time).toLocaleTimeString([], {
//                         hour: '2-digit', 
//                         minute: '2-digit'
//                       })}
//                     </span>
//                     {slot.isBooked && (
//                       <span className="text-xs text-red-600 mt-1">
//                         Booked
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}

//         {selectedSlots.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 shadow-lg flex justify-between items-center">
//             <p className="text-center flex-grow">
//               Selected Slots: {selectedSlots.map(slot => 
//                 `${new Date(slot.schedule.date).toLocaleDateString()} at ${slot.slot.label}`
//               ).join(', ')}
//             </p>
//             <button 
//               onClick={handleBookAppointment}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Book Appointments
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <NavBar />
//       <div className="container mx-auto px-4 py-8">
//         {renderContent()}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Slot;
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
//             // console.log('Full Slots Response:', JSON.stringify(response.data, null, 2));
//             console.log('Slots Response:', (response.data.schedules));
//    console.log('Schedulesnfjdfnjdnfdkfkdfkdfmkdfkdfkdfmdkfkdfkdfk:',Array.isArray(response.data.appointments),);
//             if (response.data && Array.isArray(response.data.appointments)) {
//               console.log('Schedules:', response.data.appointments);
//                 setSchedules(response.data.appointments);
//                 if (response.data.appointments.length === 0) {
//                   console.log('No available slots for this doctor');
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
//                 selectedSlot.schedule.date === schedule.date && 
//                 selectedSlot.slot.label === slot.label
//         );

//         if (isAlreadySelected) {
//             setSelectedSlots(prevSlots => 
//                 prevSlots.filter(
//                     selectedSlot => 
//                         !(selectedSlot.schedule.date === schedule.date && 
//                           selectedSlot.slot.label === slot.label)
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
//             const response = await axios.post(
//                 `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId}`, 
//                 { 
//                     slots: selectedSlots.map(selectedSlot => ({
//                         date: selectedSlot.schedule.date,
//                         slot: selectedSlot.slot.label,
//                         time: selectedSlot.slot.time // Add time if needed
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
//           console.error('Error fetching schedules:', error);
//             return <div>Error: {error}</div>;
//         }

//         // Ensure schedules is an array before mapping
//         if (!Array.isArray(schedules)) {
//           console.error('Schedules is not an array:', schedules);
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
//                             Date: {new Date(schedule.date).toLocaleDateString('en-US', {
//                                 weekday: 'long', 
//                                 year: 'numeric', 
//                                 month: 'long', 
//                                 day: 'numeric'
//                             })}
//                         </h3>
//                         <div className="grid grid-cols-3 gap-4">
//                             {schedule.timeSlots.map((slot, slotIndex) => (
//                                 <button
//                                     key={slotIndex}
//                                     onClick={() => handleSlotSelection(schedule, slot)}
//                                     className={`
//                                         p-3 rounded-lg transition-all duration-300 
//                                         ${slot.isBooked 
//                                             ? 'bg-red-200 text-red-800 cursor-not-allowed' 
//                                             : 'bg-green-200 text-green-800 hover:bg-green-300 hover:scale-105'}
//                                         ${selectedSlots.some(
//                                             selectedSlot => 
//                                                 selectedSlot.schedule.date === schedule.date && 
//                                                 selectedSlot.slot.label === slot.label
//                                         ) 
//                                             ? 'ring-4 ring-blue-500' 
//                                             : ''}
//                                     `}
//                                     disabled={slot.isBooked}
//                                 >
//                                     <div className="flex flex-col items-center">
//                                         <span className="font-semibold">{slot.label}</span>
//                                         <span className="text-sm">
//                                             {new Date(slot.time).toLocaleTimeString([], {
//                                                 hour: '2-digit', 
//                                                 minute: '2-digit'
//                                             })}
//                                         </span>
//                                         {slot.isBooked && (
//                                             <span className="text-xs text-red-600 mt-1">
//                                                 Booked
//                                             </span>
//                                         )}
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//                 {selectedSlots.length > 0 && (
//                     <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 shadow-lg flex justify-between items-center">
//                         <p className="text-center flex-grow">
//                             Selected Slots: {selectedSlots.map(slot => 
//                                 `${new Date(slot.schedule.date).toLocaleDateString()} at ${slot.slot.label}`
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
//             console.log('Full API Response:', JSON.stringify(response.data, null, 2));

//             // Use the appointments array from the response
//             if (response.data && Array.isArray(response.data.appointments)) {
//                 console.log('Schedules:', response.data.appointments);
//                 setSchedules(response.data.appointments);
//                 if (response.data.appointments.length === 0) {
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
//                 selectedSlot.schedule.date === schedule.date && 
//                 selectedSlot.slot.label === slot.label
//         );

//         if (isAlreadySelected) {
//             setSelectedSlots(prevSlots => 
//                 prevSlots.filter(
//                     selectedSlot => 
//                         !(selectedSlot.schedule.date === schedule.date && 
//                           selectedSlot.slot.label === slot.label)
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
//             const response = await axios.post(
//                 `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId}`, 
//                 { 
//                     slots: selectedSlots.map(selectedSlot => ({
//                         date: selectedSlot.schedule.date,
//                         slot: selectedSlot.slot.label,
//                         time: selectedSlot.slot.time // Add time if needed
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
//                         <div className="grid grid-cols-3 gap-4">
//                             {schedule.slotTime.map((slot, slotIndex) => (
//                                 <button
//                                     key={slotIndex}
//                                     onClick={() => handleSlotSelection(schedule, slot)}
//                                     className={`
//                                         p-3 rounded-lg transition-all duration-300 
//                                         ${slot.isBooked 
//                                             ? 'bg-red-200 text-red-800 cursor-not-allowed' 
//                                             : 'bg-green-200 text-green-800 hover:bg-green-300 hover:scale-105'}
//                                         ${selectedSlots.some(
//                                             selectedSlot => 
//                                                 selectedSlot.schedule.date === schedule.date && 
//                                                 selectedSlot.slot.label === slot.label
//                                         ) 
//                                             ? 'ring-4 ring-blue-500' 
//                                             : ''}
//                                     `}
//                                     disabled={slot.isBooked}
//                                 >
//                                     <div className="flex flex-col items-center">
//                                         <span className="font-semibold">{slot.label}</span>
//                                         <span className="text-sm">
//                                             {new Date(slot.time).toLocaleTimeString([], {
//                                                 hour: '2-digit', 
//                                                 minute: '2-digit'
//                                             })}
//                                         </span>
//                                         {slot.isBooked && (
//                                             <span className="text-xs text-red-600 mt-1">
//                                                 Booked
//                                             </span>
//                                         )}
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//                 {selectedSlots.length > 0 && (
//                     <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 shadow-lg flex justify-between items-center">
//                         <p className="text-center flex-grow">
//                             Selected Slots: {selectedSlots.map(slot => 
//                                 `${new Date(slot.schedule.date).toLocaleDateString()} at ${slot.slot.label}`
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
            console.error('No doctor selected or invalid doctor data');
            setError('No doctor selected');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log(`Fetching slots for doctor ID: ${doctorData._id}`);

            const response = await axios.get(`http://localhost:5000/api/doctor/slots/${doctorData._id}`);
            console.log('Full API Response:', JSON.stringify(response.data, null, 2));

            // Access the appointments array from the schedules object
            if (response.data && response.data.schedules && Array.isArray(response.data.schedules.appointments)) {
                console.log('Schedules:', response.data.schedules.appointments);
                setSchedules(response.data.schedules.appointments);
                if (response.data.schedules.appointments.length === 0) {
                    console.log('No available slots for this doctor');
                    setError('No available slots for this doctor');
                }
            } else {
                setError('No schedules found');
                setSchedules([]); // Ensure it's an empty array
            }
        } catch (err) {
            console.error('Error fetching slots:', err);
            setError(err.response?.data.message || 'Failed to fetch slots');
            setSchedules([]); // Reset schedules on error
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
          console.log("selectedSlots",selectedSlots);
          
          // console.log("selectedSlots",selectedSlots.schedule.appointmentDate);
            const response = await axios.post(
                `http://localhost:5000/api/user/book-appointments/${doctorData._id}/${userId}`, 
                { 
                    slots: selectedSlots.map(selectedSlot => ({
                    
                        date: selectedSlot.schedule.appointmentDate,
                        
                        // slot: selectedSlot.slot.label,
                        time: selectedSlot.schedule.slotTime // Add time if needed
                    }))
                }
            );

            console.log('Appointments booked successfully', response.data);
            fetchDoctorSchedules();
            setSelectedSlots([]);
            alert('Appointments booked successfully');
        } catch (error) {
            console.error('Error booking appointments:', error);
            alert(error.response?.data?.message || 'Error booking appointments');
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            console.error('Error fetching schedules:', error);
            return <div>Error: {error}</div>;
        }

        // Ensure schedules is an array before mapping
        if (!Array.isArray(schedules)) {
            console.error('Schedules is not an array:', schedules);
            return <div>No available slots for this doctor</div>;
        }

        if (schedules.length === 0) {
            return <div>No available slots for this doctor</div>;
        }

        return (
            <div>
                <h2>Available Slots:</h2>
                {schedules.map((schedule, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <h3 className="text-xl font-semibold mb-4">
                            Date: {new Date(schedule.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            })}
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => handleSlotSelection(schedule, {
                                    appointmentDate: schedule.appointmentDate,
                                    slotTime: schedule.slotTime,
                                    isBooked: false // Adjust based on your logic
                                })}
                                className="p-3 rounded-lg bg-green-200 hover:bg-green-300"
                            >
                                {schedule.slotTime}
                            </button>
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