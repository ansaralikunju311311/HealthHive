// ...existing code...
    } else if (filter === 'weekly') {
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            // Use locale format 'en-CA' to get YYYY-MM-DD format matching aggregation
            const dateStr = date.toLocaleDateString('en-CA');
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

            const appointmentFound = appointmentData.find(item => item._id === dateStr);
            const revenueFound = revenueData.find(item => item._id === dateStr);

            formattedData.appointments.labels.push(dayLabel);
            formattedData.revenue.labels.push(dayLabel);
            formattedData.appointments.data.push(appointmentFound ? appointmentFound.count : 0);
            formattedData.revenue.data.push(revenueFound ? revenueFound.earnings * 0.9 : 0);
        }
    }
// ...existing code...
