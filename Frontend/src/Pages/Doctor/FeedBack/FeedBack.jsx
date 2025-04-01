import React, { useState, useEffect } from 'react'
import { feedBack } from '../../../Services/doctorService/doctorService';
import Sidebar from '../../../Component/Doctor/Sidebar';
import DataTable from '../../../Components/Common/DataTable';
import { FaStar } from 'react-icons/fa';

const FeedBack = () => {
  const id = JSON.parse(localStorage.getItem('doctorId'))
  const doctorid = id._id;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedBack = async () => {
      try {
        const response = await feedBack(doctorid);
        setFeedbacks(response);
        console.log(response)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      }
    };
    fetchFeedBack();
  }, [doctorid]);

  const columns = [
    {
      header: 'Patient',
      accessor: 'user',
      render: (row) => (
        <div className="flex items-center">
          <img
            src={row.user.image || 'https://via.placeholder.com/40'}
            alt={row.user.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-medium text-gray-900">{row.user.name}</span>
        </div>
      ),
    },
    {
      header: 'Feedback',
      accessor: 'feedback',
      render: (row) => (
        <div className="max-w-md">
          <p className="text-gray-600">{row.feedback}</p>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      width: '150px',
      render: (row) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`w-5 h-5 ${index < row.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-gray-600">{row.rating}/5</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-12">
      <div className="col-span-12 md:col-span-3 bg-white shadow-md">
        <Sidebar activePage="feedback" doctorid={doctorid} />
      </div>
      <div className="col-span-12 md:col-span-9 p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Patient Feedback</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={feedbacks}
              emptyMessage="No feedback available yet"
              headerClassName="bg-gray-50"
              rowClassName="hover:bg-gray-50 transition-colors duration-200"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedBack