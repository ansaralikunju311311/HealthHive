import React from 'react'
import Bannerdoctor from '../../../assets/Bannerdoctor.png'

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-50 min-h-[500px]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Text content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Kindly reach us to get the fastest response and treatment.
            </p>
            
            {/* Doctor Info Card */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-sm">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">Dr. David James, MD</h3>
                  <p className="text-sm text-gray-500">Pediatrician</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Available Mon - Sat, 7 AM - 5 PM</p>
            </div>

            {/* Patient Stats */}
            <div className="bg-white p-4 rounded-lg shadow-md max-w-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">1260+</h3>
                  <p className="text-sm text-gray-500">Happy Patient</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="md:w-1/2">
            <img 
              src={Bannerdoctor} 
              alt="Doctor" 
              className="w-full h-auto max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner