import { useEffect, useState } from "react"
import axios from "axios" 
import { useNavigate } from "react-router-dom";
import cookies from 'js-cookie';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const token = cookies.get('useraccessToken');
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/user/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true,
          });
          setUserData(response.data.user);

           const response1 = await axios.get('http://localhost:5000/api/doctor/departments', {
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
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Departments
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Specialized care departments to serve all your healthcare needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <div
              key={department._id}
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {department.Departmentname}
                </h3>
                <p className="text-gray-600 mb-4">
                  {department.Description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    department.status === 'Listed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {department.status}
                  </span>
                  <button
                    onClick={() => navigate(`/department/${department._id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Department;