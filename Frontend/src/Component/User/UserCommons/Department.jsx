import { useEffect, useState } from "react"
import axios from "axios" 
import { useNavigate } from "react-router-dom";
import cookies from 'js-cookie';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate()

  // Add this gradient configuration
  const departmentGradients = {
    'Cardiology': 'from-rose-100 via-rose-200 to-rose-300',
    'Neurology': 'from-violet-100 via-violet-200 to-violet-300',
    'Dental': 'from-sky-100 via-sky-200 to-sky-300',
    'Ophthalmology': 'from-emerald-100 via-emerald-200 to-emerald-300',
    'Pulmonology': 'from-indigo-100 via-indigo-200 to-indigo-300',
    'Pediatrics': 'from-pink-100 via-pink-200 to-pink-300',
    'Infectious Diseases': 'from-amber-100 via-amber-200 to-amber-300',
    'General': 'from-slate-100 via-slate-200 to-slate-300'
  };

  useEffect(() => {
    console.log("use effect");
    const token = cookies.get('usertoken');
    console.log("token from cookie", token);
    if (token) {
      console.log("token", token);
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/user/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true,
          });
          setUserData(response.data.user);
          console.log("user data", response.data.user);
          console.log("token", token);
          console.log("user data", userData);

           const response1 = await axios.get('http://localhost:5000/api/user/departments', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true,
          });
          setDepartments(response1.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);
  
  return (
    <>
      {userData ? (
        <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title section remains unchanged */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Our Departments
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Specialized care departments to serve all your healthcare needs
              </p>
            </div>

            {/* New departments container with improved hover effect */}
            <div className="relative">
              <div className="sticky top-4 z-20 flex justify-center mb-8">
                <button
                  onClick={() => navigate('/book-appointment')}
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

              <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {departments.map((department) => (
                  <div 
                    key={department._id} 
                    className="group cursor-pointer"
                    // onClick={() => navigate(`/book-appointment?department=${department._id}`)}
                  >
                    <div className={`h-full bg-gradient-to-br ${departmentGradients[department.Departmentname] || 'from-gray-100 via-gray-200 to-gray-300'} 
                                  rounded-xl shadow-md overflow-hidden transform transition-all duration-300 
                                  group-hover:shadow-2xl group-hover:-translate-y-1`}>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                          {department.Departmentname}
                        </h3>
                        <p className="text-gray-600">
                          {department.Description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Department;





