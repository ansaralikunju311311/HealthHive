import { useEffect, useState } from "react"
import axios from "axios" 
import { useNavigate } from "react-router-dom";
import cookies from 'js-cookie';
import Heading from "../Appoiment/Heading";
import Schedulebtn from "../Appoiment/Schedulebtn";
import { getDepartments,getAppointments } from "../../../Services/apiService";

const Datadpt = ({ limit =null}) => {
  const [departments, setDepartments] = useState([]);
  const [departmentColors, setDepartmentColors] = useState({});
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  const generateRandomGradient = () => {
    const colors = [
      'rose', 'violet', 'sky', 'emerald', 'indigo', 
      'pink', 'amber', 'blue', 'green', 'purple',
      'teal', 'cyan', 'fuchsia', 'lime'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `from-${randomColor}-100 via-${randomColor}-200 to-${randomColor}-300`;
  };

  useEffect(() => {
    const newDepartmentColors = {};
    departments.forEach(dept => {
      if (!departmentColors[dept._id]) {
        newDepartmentColors[dept._id] = generateRandomGradient();
      }
    });
    setDepartmentColors(prev => ({ ...prev, ...newDepartmentColors }));
  }, [departments]);

  useEffect(() => {


const loadDepartments = async () => {
  try {
    const departments = await getDepartments();
    setDepartments(departments);
  } catch (error) {
    console.error('Error loading departments:', error);
  }
};
loadDepartments();
  }, []);
  const handleDepartmentClick = async (department) => {   


    try {
      const data = await getAppointments(department.Departmentname);
      console.log("data", data);
      navigate('/bookings',{state: { data: data }})
    } catch (error) {
      console.error('Error fetching appointments:', error);
      
    }

  };
  
  return (
    <>
    
        <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
           
    
         



            <div className="relative">
                

              <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {(limit ? departments.slice(0, limit) : departments).map((department) => (
               

                  <div 
                    key={department._id} 
                    className="group cursor-pointer"
                    onClick={()=>handleDepartmentClick(department)} >
                    <div className={`h-full bg-gradient-to-br ${departmentColors[department._id]} 
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
     
    </>
  );
};
export default Datadpt;





