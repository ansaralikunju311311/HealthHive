import React from 'react';
import { useNavigate } from 'react-router-dom';
import Bannerdoctor from '../assets/Bannerdoctor.png';
import DoctorsList from '../assets/doctorslist.png';
import Treatment from '../assets/treatment 1.png';
import DoctorOne from '../assets/Doctorone.png';
import DoctorTwo from '../assets/doctortwo.png';
import DoctorThree from '../assets/doctorthree.png';
import DoctorFour from '../assets/doctorfour.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const SignUp = () => {
    navigate('/Signup');
  };

  const Login = () => {
    navigate('/Login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HealthHive</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('/')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </button>
              <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </button>
              <button onClick={() => navigate('/appointment')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Appointment
              </button>
              <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact Us
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => navigate('/')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/about')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              About
            </button>
            <button onClick={() => navigate('/appointment')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              Appointment
            </button>
            <button onClick={() => navigate('/contact')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ProHealth Medical & Healthcare Center
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your trusted partner in healthcare. We provide comprehensive medical services with a focus on patient care and well-being.
            </p>
            <button onClick={SignUp} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg">
              Get Started
            </button>
          </div>
          <div>
            <img src={Bannerdoctor} alt="Healthcare Professional" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* Our Specialties */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Cardiac Science', description: 'Expert cardiac care with state-of-the-art facilities' },
              { title: 'Dental Care', description: 'Comprehensive dental services for the whole family' },
              { title: 'Primary Care', description: 'Your first point of contact for all health concerns' }
            ].map((specialty, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{specialty.title}</h3>
                <p className="text-gray-600">{specialty.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services We Provide */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Services We Provide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🏥", title: "24/7 Service", description: "Round-the-clock medical care" },
              { icon: "👨‍⚕️", title: "Expert Doctors", description: "Experienced healthcare professionals" },
              { icon: "💊", title: "Medicines", description: "Full-service pharmacy available" },
              { icon: "🚑", title: "Emergency Care", description: "Immediate medical attention" }
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Doctors */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
            <p className="text-xl text-gray-600">
              Our team of highly qualified medical professionals is here to provide you with the best healthcare services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialty: "Cardiologist",
                experience: "15+ Years Experience",
                image: DoctorOne,
                availability: "Mon - Fri"
              },
              {
                name: "Dr. Michael Chen",
                specialty: "Neurologist",
                experience: "12+ Years Experience",
                image: DoctorTwo,
                availability: "Tue - Sat"
              },
              {
                name: "Dr. Emily Parker",
                specialty: "Pediatrician",
                experience: "10+ Years Experience",
                image: DoctorThree,
                availability: "Mon - Sat"
              },
              {
                name: "Dr. James Wilson",
                specialty: "Orthopedic Surgeon",
                experience: "18+ Years Experience",
                image: DoctorFour,
                availability: "Wed - Sun"
              }
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-80 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                        Available Today
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {doctor.availability}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {doctor.experience}
                  </div>

                  <button 
                    onClick={() => navigate('/appointment')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center group"
                  >
                    Book Appointment
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium group">
              View All Doctors
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Exceptional Care Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img src={Treatment} alt="Dental Care" className="w-full rounded-lg shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Exceptional Dental Care, on Your Terms</h2>
              <p className="text-gray-600 mb-8">
                We provide top-quality dental care with a focus on patient comfort and satisfaction. Our experienced team uses the latest technology to ensure the best possible outcomes for our patients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  "Excellent service and care. The staff was very professional and attentive to my needs."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Patient Name</p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stay Connected Form */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Stay connected with us</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 rounded-md text-gray-900"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-2 rounded-md text-gray-900"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-2 rounded-md text-gray-900"
              ></textarea>
              <button type="submit" className="w-full bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HealthHive</h3>
              <p className="text-gray-400">Your trusted healthcare partner</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency Care</li>
                <li>Dental Care</li>
                <li>Primary Care</li>
                <li>Specialized Treatment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@healthhive.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 Medical Center Dr</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HealthHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
