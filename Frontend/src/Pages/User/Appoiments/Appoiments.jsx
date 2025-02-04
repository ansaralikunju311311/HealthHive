import React from 'react'
import Navbar from "../../../Common/NavBar";
import Footer from "../../../Common/Footer";
import Datadpt from '../../../Component/User/Appoiment/Datadpt';

const Appoiments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-50 to-indigo-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-gray-800">
                Book your <span className="text-sky-600">Appointments</span>
              </h1>
              <div className="bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold">
                {/* Total Appointments: 0 */}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
              <Datadpt />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Appoiments