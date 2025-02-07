import React, { useState, useEffect } from 'react';
import NavBar from '../../../Common/NavBar';
import { useLocation } from 'react-router-dom';
import Footer from '../../../Common/Footer';
import axios from 'axios';

const Slot = () => {
  const location = useLocation();
  const doctorData = location.state?.doctor;
  
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      // Validate doctor data
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
        
        console.log('Full Slots Response:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.schedules) {
          setSchedules(response.data.schedules);
          if (response.data.schedules.length === 0) {
            setError('No available slots for this doctor');
          }
        } else {
          setError('No schedules found');
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        
        // More detailed error handling
        if (err.response) {
          setError(err.response.data.message || 'Failed to fetch slots');
        } else if (err.request) {
          setError('No response received from server');
        } else {
          setError('Error setting up the request');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorData?._id]);

  const handleSlotSelection = (schedule, slot) => {
    setSelectedSlot({ schedule, slot });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
          <p className="ml-4">Loading schedules...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }

    if (schedules.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <p>No available slots for this doctor</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Available Slots for Dr. {doctorData.name}
        </h2>
        {schedules.map((schedule, scheduleIndex) => (
          <div 
            key={scheduleIndex} 
            className="bg-white shadow-md rounded-lg p-6 mb-4"
          >
            <h3 className="text-xl font-semibold mb-4">
              Date: {new Date(schedule.date).toLocaleDateString('en-US', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {schedule.timeSlots.map((slot, slotIndex) => (
                <button
                  key={slotIndex}
                  onClick={() => handleSlotSelection(schedule, slot)}
                  className={`
                    p-3 rounded-lg transition-all duration-300 
                    ${slot.isBooked 
                      ? 'bg-red-200 text-red-800 cursor-not-allowed' 
                      : 'bg-green-200 text-green-800 hover:bg-green-300 hover:scale-105'}
                    ${selectedSlot?.slot === slot 
                      ? 'ring-4 ring-blue-500' 
                      : ''}
                  `}
                  disabled={slot.isBooked}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{slot.label}</span>
                    <span className="text-sm">
                      {new Date(slot.time).toLocaleTimeString([], {
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </span>
                    {slot.isBooked && (
                      <span className="text-xs text-red-600 mt-1">
                        Booked
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {selectedSlot && (
          <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 shadow-lg">
            <p className="text-center">
              Selected Slot: {selectedSlot.schedule.date} at {selectedSlot.slot.label}
            </p>
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