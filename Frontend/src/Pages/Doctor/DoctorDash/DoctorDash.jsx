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
import autoTable from 'jspdf-autotable';

const notoSansNormalBase64 = '...'; // Replace with actual base64 encoded font data

const DoctorDash = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [report, setReport] = useState(null);  // Fixed typo in Setreport to setReport
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [filter, setFilter] = useState('today');

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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

  
   
    
    doc.setFillColor(79, 70, 229); 
    doc.rect(0, 0, pageWidth, 45, "F");

    try {
      doc.addImage("/logo.png", "PNG", 15, 8, 30, 30);
    } catch (error) {
      console.warn("Could not load logo:", error);
    }

    // Header text
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("HealthHive Report", 55, 25);
    doc.setFontSize(12);
    doc.text(`${filter.toUpperCase()} SUMMARY`, 55, 35);

    // Doctor info section
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(15, 60, pageWidth - 15, 60);

    doc.setTextColor(79, 70, 229);
    doc.setFontSize(14);
    doc.text(`Dr. ${doctor?.name}`, 15, 55);




    
    const boxWidth = (pageWidth - 45) / 3;
    const boxes = [
      { title: 'Total Appointments', value: appointmentStats?.totalAppointments || 0 },
      { title: 'Total Revenue', value: `Rs. ${appointmentStats?.totalAppointments * appointmentStats?.fee?.consultFee || 0}` },
      { title: 'Average Revenue', value: `Rs. ${appointmentStats?.fee?.consultFee || 0}` }
    ];

    boxes.forEach((box, index) => {
      const x = 15 + (index * (boxWidth + 7.5));
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(x, 70, boxWidth, 40, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(box.title, x + 10, 85);
      
      doc.setFontSize(16);
      doc.setTextColor(79, 70, 229);
      doc.text(box.value.toString(), x + 10, 100);
    });

    // Appointment details
    let yPos = 130;
    report.forEach((rep, index) => {
      // Date section
      doc.setFillColor(79, 70, 229);
      doc.setTextColor(255, 255, 255);
      doc.rect(15, yPos, pageWidth - 30, 12, "F");
      doc.setFontSize(11);
      doc.text(rep._id, 25, yPos + 8);

      // Table for this date
      autoTable(doc, {
        startY: yPos + 12,
        margin: { left: 15, right: 15 },
        head: [['Patient', 'Fee', 'Date', 'Time Slot']],
        body: rep.details.map(detail => [
          detail.PatientName || '-',
          `Rs. ${detail.Fee || 0}`,
          new Date(detail.Date).toLocaleDateString() || '-',
          detail.Slot || '-'
        ]),
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 5,
          lineColor: [243, 244, 246],
          lineWidth: 0.5
        },
        headStyles: {
          fillColor: [249, 250, 251],
          textColor: [79, 70, 229],
          fontStyle: 'bold',
          lineWidth: 0
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 30, halign: 'right' },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 }
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        }
      });

      yPos = doc.lastAutoTable.finalY + 20;

      // Add new page if needed
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Footer
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("Generated by HealthHive", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`HealthHive-${filter}-Report-${Date.now()}.pdf`);
  };

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
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Welcome, Dr. {doctor?.name}</h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600">Here's what's happening with your practice</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {doctor?.profileImage && (
                <img
                  src={doctor.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-white shadow-md hover:border-blue-500 transition-all duration-200"
                  onClick={() => navigate('/profile', { state: { userId: doctor._id } })}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-4 transform hover:scale-[1.02]">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointmentStats?.totalAppointments || 0}</p>
                <p className="text-sm text-gray-500 mt-1">All time appointments</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Appointment Trends
                </h2>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleFilter}
                    value={filter === 'today' ? '1' : filter === 'weekly' ? '2' : filter === 'monthly' ? '3' : '4'}
                  >
                    <option value="1">Today</option>
                    <option value="2">Weekly</option>
                    <option value="3">Monthly</option>
                    <option value="4">Yearly</option>
                  </select>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200" 
                    onClick={exportPDF}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200" 
                    onClick={exportExcel}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
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