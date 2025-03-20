import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Sidebar from '../../../Component/Doctor/Sidebar';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { getDashboardData, appoimentDetails, verifyDoctorToken } from '../../../Services/doctorService/doctorService';

const DoctorDash = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [report, setReport] = useState(null);  // Fixed typo in Setreport to setReport
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [filter, setFilter] = useState('today');

  // Initial token verification and data fetch
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await verifyDoctorToken();
        const doctorData = response?.doctor;
        setDoctor(doctorData);

        const appointmentResponse = await appoimentDetails(doctorData._id);
        setAppointmentStats(appointmentResponse);

        localStorage.setItem('doctorId', JSON.stringify(doctorData));
        setLoading(false);

        if (doctorData.isBlocked && doctorData.isActive) {
          cookies.remove('doctortoken');
          toast.error('Your account has been blocked');
          navigate('/doctor/login');
        }
      } catch (error) {
        cookies.remove('doctortoken');
        toast.error('Session expired. Please login again');
        navigate('/doctor/login');
      }
    };
    verifyToken();
  }, [navigate]);

  // Fetch dashboard data when filter or doctor changes
  useEffect(() => {
    if (!doctor?._id) return;

    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData(doctor._id, filter);
        setDashboardData(response.formattedData);
        setReport(response.findReports);
        console.log("report correctly", response.findReports);
      } catch (error) {
        toast.error('Error fetching dashboard data');
      }
    };
    fetchDashboardData();
  }, [filter, doctor]);

  // Filter handler
  const handleFilter = (e) => {
    const filterMap = {
      '1': 'today',
      '2': 'weekly',
      '3': 'monthly',
      '4': 'yearly'
    };
    setFilter(filterMap[e.target.value] || 'today');
  };

  const exportPDF = async () => {
    if (!report) return;
    const doc = new jsPDF();

    const loadImageAsBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
      });
    };

   
    const logoBase64 = await loadImageAsBase64('/logo.png');

    doc.addImage(logoBase64, 'PNG', 10, 5, 30, 30);

    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('HealthHive', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text('Doctor Dashboard Report', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
  
    doc.setLineWidth(1);
    doc.line(10, 35, doc.internal.pageSize.getWidth() - 10, 35);
    
    doc.setFontSize(12);
    doc.text(`Doctor: Dr. ${doctor?.name}`, 10, 45);
    doc.text(`Filter: ${filter} Report`, 10, 53);
    
  
    const totalAppointments = appointmentStats ? appointmentStats.totalAppointments : 0;
    const totalRevenue = dashboardData && dashboardData.revenue && dashboardData.revenue.data 
      ? dashboardData.revenue.data.reduce((sum, curr) => sum + curr, 0)
      : 0;
      
    doc.text(`Total Appointments: ${totalAppointments}`, 10, 61);
    doc.text(`Total Revenue: ${totalRevenue}`, 120, 61);
    

    let yPosition = 69;
      
    doc.setLineWidth(0.5);
    doc.line(10, yPosition, doc.internal.pageSize.getWidth() - 10, yPosition);
    yPosition += 6;
      
    doc.text('Appointment Reports:', 10, yPosition);
    yPosition += 8;
      
    report.forEach((rep) => {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Report Date: ${rep._id}`, 10, yPosition);
      yPosition += 8;
        
      // Table headers
      doc.setFontSize(10);
      doc.text('Patient', 12, yPosition);
      doc.text('Fee', 50, yPosition);
      doc.text('Date', 70, yPosition, { maxWidth: 35 });
      doc.text('Appt. Date', 110, yPosition);
      doc.text('Slot', 150, yPosition);
      yPosition += 6;
        
      rep.details.forEach((detail) => {
        doc.text(detail.PatientName || '-', 12, yPosition);
        doc.text(`${detail.Fee || 0}`, 50, yPosition);
        doc.text(new Date(detail.Date).toLocaleString().slice(0,10) || '-', 70, yPosition, { maxWidth: 35 });
        doc.text(detail.AppoimentDate || '-', 110, yPosition);
        doc.text(detail.Slot || '-', 150, yPosition);
        yPosition += 6;
        
        if (yPosition > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPosition = 20;
        }
      });
      yPosition += 4;
    });
    
    doc.save(`dashboard-${filter}-${Date.now()}.pdf`);
  };

  // Export to Excel
  const exportExcel = () => {
    if (!report) return;

    const data = report.flatMap(rep =>
      rep.details.map(detail => ({
        "Report Date": rep._id,
        "Patient": detail.PatientName || '-',
        "Fee": detail.Fee || 0,
        "Date": detail.Date ? new Date(detail.Date).toLocaleString().slice(0, 10) : '-',
        "Appt. Date": detail.AppoimentDate || '-',
        "Slot": detail.Slot || '-'
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AppointmentReports');
    XLSX.writeFile(workbook, `dashboard-${filter}-${Date.now()}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar doctorid={doctor._id} />
      <div className="flex-1 p-4 md:p-8 md:ml-64 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold">Welcome, Dr. {doctor?.name}</h1>
            <div className="flex items-center space-x-4">
              {doctor?.profileImage && (
                <img
                  src={doctor.profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() => navigate('/profile', { state: { userId: doctor._id } })}
                />
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold">{appointmentStats?.totalAppointments || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-2xl font-bold">{appointmentStats?.uniquePatients || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Payment Due</p>
                <p className="text-2xl font-bold">
                  ₹{(appointmentStats?.totalAppointments * appointmentStats?.fee?.consultFee * 0.9) || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Appointment Trends</h2>
                <div className="flex space-x-2">
                  <select
                    className="border rounded-md px-4 py-2"
                    onChange={handleFilter}
                    value={filter === 'today' ? '1' : filter === 'weekly' ? '2' : filter === 'monthly' ? '3' : '4'}
                  >
                    <option value="1">Today</option>
                    <option value="2">Weekly</option>
                    <option value="3">Monthly</option>
                    <option value="4">Yearly</option>
                  </select>
                  <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600" onClick={exportPDF}>
                    PDF
                  </button>
                  <button className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600" onClick={exportExcel}>
                    Excel
                  </button>
                </div>
              </div>
              {dashboardData?.appointments ? (
                <ResponsiveContainer width="100%" height={400}>
                  {filter === 'today' ? (
                    <LineChart data={dashboardData.appointments.labels.map((label, i) => ({
                      time: label,
                      appointments: dashboardData.appointments.data[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" interval={2} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="appointments" stroke="#3b82f6" />
                    </LineChart>
                  ) : (
                    <BarChart data={dashboardData.appointments.labels.map((label, i) => ({
                      period: label,
                      appointments: dashboardData.appointments.data[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" interval={filter === 'monthly' ? 2 : 0} angle={filter === 'monthly' ? -45 : 0} textAnchor={filter === 'monthly' ? 'end' : 'middle'} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="appointments" fill="#3b82f6" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-[400px]">Loading...</div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Earnings Overview</h2>
              {dashboardData?.revenue ? (
                <ResponsiveContainer width="100%" height={400}>
                  {filter === 'today' ? (
                    <LineChart data={dashboardData.revenue.labels.map((label, i) => ({
                      time: label,
                      earnings: dashboardData.revenue.data[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" interval={2} />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Legend />
                      <Line type="monotone" dataKey="earnings" stroke="#059669" />
                    </LineChart>
                  ) : (
                    <BarChart data={dashboardData.revenue.labels.map((label, i) => ({
                      period: label,
                      earnings: dashboardData.revenue.data[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" interval={filter === 'monthly' ? 2 : 0} angle={filter === 'monthly' ? -45 : 0} textAnchor={filter === 'monthly' ? 'end' : 'middle'} />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                      <Legend />
                      <Bar dataKey="earnings" fill="#059669" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-[400px]">Loading...</div>
              )}
            </div>
          </div>
          
          {/* Display Appointment Reports */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Appointment Reports</h2>
            {report && report.length > 0 ? (
              report.map((rep) => (
                <div key={rep._id} className="border rounded p-4 mb-4 bg-white shadow-md">
                  <h3 className="font-semibold mb-2 text-lg">Report Date: {rep._id}</h3>
                  {rep.details.map((detail, idx) => (
                    <div key={idx} className="mb-2 text-sm">
                      <p><span className="font-medium">Patient:</span> {detail.PatientName}</p>
                      <p><span className="font-medium">Fee:</span> ₹{detail.Fee}</p>
                      <p><span className="font-medium">Date:</span> {new Date(detail.Date).toLocaleString()}</p>
                      <p><span className="font-medium">Appointment Date:</span> {detail.AppoimentDate}</p>
                      <p><span className="font-medium">Slot:</span> {detail.Slot}</p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No appointment reports found.</p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;