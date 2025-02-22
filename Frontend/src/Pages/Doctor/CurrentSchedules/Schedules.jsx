import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Component/Doctor/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Box, Card, Typography, Button, Container, Grid, Paper, Chip, IconButton, Divider } from '@mui/material';
import { 
    Add as AddIcon, 
    Event as EventIcon, 
    AccessTime as AccessTimeIcon, 
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';

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

    const isSlotExpired = (dateStr, timeStr) => {
        const [startTime] = timeStr.split(' - ');
        const [hour, period] = startTime.split(' ');
        const slotDate = new Date(dateStr);
        const hourNum = parseInt(hour);
        const adjustedHour = period === 'PM' && hourNum !== 12 ? hourNum + 12 : (period === 'AM' && hourNum === 12 ? 0 : hourNum);
        slotDate.setHours(adjustedHour, 0, 0, 0);
        return slotDate < new Date();
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
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc' }}>
            <Sidebar activePage="Schedules" />

            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
                <Container maxWidth="xl" sx={{ mt: 2 }}>
                    {/* Header */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4 
                    }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <ScheduleIcon sx={{ fontSize: 35, color: '#3b82f6' }} />
                            Schedule Management
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsOpen(true)}
                            sx={{ 
                                bgcolor: '#3b82f6',
                                '&:hover': { bgcolor: '#2563eb' },
                                borderRadius: 2,
                                px: 3,
                                py: 1
                            }}
                        >
                            Add Schedule
                        </Button>
                    </Box>

                    {/* Legend */}
                    <Paper sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'white' }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: '#475569', fontWeight: 'medium' }}>
                            Status Guide:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Chip
                                icon={<AccessTimeIcon />}
                                label="Available"
                                sx={{ bgcolor: '#e2e8f0', color: '#475569' }}
                            />
                            <Chip
                                icon={<CheckCircleIcon />}
                                label="Booked"
                                sx={{ bgcolor: '#bbf7d0', color: '#166534' }}
                            />
                            <Chip
                                icon={<CancelIcon />}
                                label="Expired"
                                sx={{ bgcolor: '#fecaca', color: '#991b1b' }}
                            />
                        </Box>
                    </Paper>

                    {/* Schedule Modal */}
                    {isOpen && (
                        <Box sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            backdropFilter: 'blur(5px)'
                        }}>
                            <Card sx={{ 
                                p: 4, 
                                maxWidth: 600,
                                width: '90%',
                                maxHeight: '85vh',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                borderRadius: 3
                            }}>
                                <IconButton
                                    onClick={handleClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: '#64748b'
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>

                                <Typography variant="h5" sx={{ mb: 3, color: '#1e293b', fontWeight: 'bold' }}>
                                    Create New Schedule
                                </Typography>

                                <Box sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    overflow: 'auto',
                                    flex: 1,
                                    pr: 1 // Add padding for scrollbar
                                }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1, color: '#475569' }}>
                                            Select Date:
                                        </Typography>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={date => setSelectedDate(date)}
                                            minDate={today}
                                            maxDate={maxDate}
                                            dateFormat="MMMM d, yyyy"
                                            popperPlacement="bottom"
                                            popperModifiers={[
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, 10]
                                                    }
                                                },
                                                {
                                                    name: "preventOverflow",
                                                    options: {
                                                        boundary: 'viewport',
                                                        padding: 20
                                                    }
                                                }
                                            ]}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            calendarClassName="shadow-lg rounded-lg border-0"
                                        />
                                    </Box>

                                    {selectedDate && (
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ mb: 2, color: '#475569' }}>
                                                Select Time Slots:
                                            </Typography>
                                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                                {timeSlots.map((slot, index) => {
                                                    const isSelected = selectedTimeSlots[selectedDate.toDateString()]?.some(
                                                        selectedSlot => selectedSlot.label === slot.label
                                                    );
                                                    const isPast = isPastSlot(slot);

                                                    return (
                                                        <Grid item xs={6} sm={4} key={index}>
                                                            <Chip
                                                                icon={<AccessTimeIcon />}
                                                                label={slot.label}
                                                                onClick={() => !isPast && handleTimeSlotClick(slot)}
                                                                sx={{
                                                                    width: '100%',
                                                                    justifyContent: 'flex-start',
                                                                    bgcolor: isPast ? '#fecaca' :
                                                                             isSelected ? '#bbf7d0' : '#e2e8f0',
                                                                    color: isPast ? '#991b1b' :
                                                                            isSelected ? '#166534' : '#475569',
                                                                    '&:hover': !isPast && {
                                                                        bgcolor: isSelected ? '#86efac' : '#cbd5e1'
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Box>
                                    )}
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={handleSchedule}
                                    fullWidth
                                    sx={{ 
                                        mt: 3,
                                        bgcolor: '#3b82f6',
                                        '&:hover': { bgcolor: '#2563eb' },
                                        borderRadius: 2,
                                        py: 1.5
                                    }}
                                >
                                    Save Schedule
                                </Button>
                            </Card>
                        </Box>
                    )}

                    {/* Existing Schedules */}
                    <Typography variant="h5" sx={{ mb: 3, color: '#1e293b', fontWeight: 'medium' }}>
                        Current Schedules
                    </Typography>

                    {existingSchedules.length === 0 ? (
                        <Paper sx={{ 
                            p: 4, 
                            textAlign: 'center', 
                            bgcolor: 'white',
                            borderRadius: 2
                        }}>
                            <ScheduleIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                            <Typography color="textSecondary">No schedules available</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
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

                                return Object.values(schedulesByDate).map((dateSchedule, index) => (
                                    <Grid item xs={12} md={6} lg={4} key={index}>
                                        <Card sx={{ 
                                            height: '100%',
                                            bgcolor: 'white',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4
                                            }
                                        }}>
                                            <Box sx={{ 
                                                bgcolor: '#3b82f6',
                                                color: 'white',
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                <EventIcon />
                                                <Typography variant="h6">
                                                    {new Date(dateSchedule.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 2 }}>
                                                <Grid container spacing={1}>
                                                    {dateSchedule.slots.map((slot, slotIndex) => {
                                                        const isExpired = isSlotExpired(dateSchedule.date, slot.slotTime);
                                                        return (
                                                            <Grid item xs={12} key={slotIndex}>
                                                                <Chip
                                                                    icon={
                                                                        isExpired ? <CancelIcon /> :
                                                                        slot.isBooked ? <CheckCircleIcon /> :
                                                                        <AccessTimeIcon />
                                                                    }
                                                                    label={slot.slotTime}
                                                                    sx={{
                                                                        width: '100%',
                                                                        justifyContent: 'flex-start',
                                                                        mb: 0.5,
                                                                        bgcolor: isExpired ? '#fecaca' :
                                                                                 slot.isBooked ? '#bbf7d0' : '#e2e8f0',
                                                                        color: isExpired ? '#991b1b' :
                                                                                slot.isBooked ? '#166534' : '#475569'
                                                                    }}
                                                                />
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ));
                            })()}
                        </Grid>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default Schedules;