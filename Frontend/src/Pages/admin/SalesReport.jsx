import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
const SalesReport = () => {
  const [filter, setFilter] = useState('today');
  const [salesData, setSalesData] = useState([]);
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    const dummyData = [
      { name: '00:00', sales: 100 },
      { name: '04:00', sales: 200 },
      { name: '08:00', sales: 150 },
      { name: '12:00', sales: 300 },
      { name: '16:00', sales: 250 },
      { name: '20:00', sales: 350 }
    ];
    setSalesData(dummyData);
  }, [filter]);
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 10, 10);
    let y = 20;
    doc.text('Time', 10, y);
    doc.text('Sales', 70, y);
    y += 10;
    salesData.forEach(item => {
      doc.text(item.name, 10, y);
      doc.text(String(item.sales), 70, y);
      y += 10;
    });
    doc.save('sales-report.pdf');
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesReport');
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage="/admin/sales-report" />
      <div className="flex-1 ml-0 md:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl md:text-2xl font-semibold">Sales Report</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <select 
                className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFilter}
                value={filter}
              >
                <option value="today">Today</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button 
                className="bg-blue-500 text-white rounded-md px-4 py-2"
                onClick={exportPDF}
              >
                Export PDF
              </button>
              <button 
                className="bg-green-500 text-white rounded-md px-4 py-2"
                onClick={exportExcel}
              >
                Export Excel
              </button>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#666' }} />
                  <YAxis tick={{ fill: '#666' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Sales" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SalesReport;
