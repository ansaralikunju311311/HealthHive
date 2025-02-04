import React from 'react'
import { useNavigate } from 'react-router-dom'
const Schedulebtn = () => {
  const navigate = useNavigate();
  return (
    <div>

<div className="sticky top-4 z-20 flex justify-center mb-8">
                <button
                  onClick={() => navigate('/appointment')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg 
                           hover:bg-blue-700 transform hover:scale-105 transition-all duration-300
                           flex items-center space-x-2"
                >
                  <span>Schedule Your Appointment</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
    </div>
  )
}

export default Schedulebtn