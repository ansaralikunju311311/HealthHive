



// import React from 'react';
// import { useEffect, useState } from "react"
// import axios from "axios" 
// import { useNavigate } from "react-router-dom";
// import cookies from 'js-cookie';
// import { 
//   FaHeartbeat, 
//   FaBrain, 
//   FaTooth, 
//   FaEye, 
//   FaLungs, 
//   FaChild, 
//   FaVirus,
//   FaHospital 
// } from 'react-icons/fa';

// const Department = () => {
//   const [departments, setDepartments] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate()

//   // Department icon mapping
//   const departmentIcons = {
//     'Cardiology': FaHeartbeat,
//     'Neurology': FaBrain,
//     'Dental': FaTooth,
//     'Ophthalmology': FaEye,
//     'Pulmonology': FaLungs,
//     'Pediatrics': FaChild,
//     'Infectious Diseases': FaVirus,
//     'General': FaHospital
//   };

//   // Department gradient colors
//   const departmentGradients = {
//     'Cardiology': 'from-red-100 to-red-200',
//     'Neurology': 'from-purple-100 to-purple-200',
//     'Dental': 'from-blue-100 to-blue-200',
//     'Ophthalmology': 'from-green-100 to-green-200',
//     'Pulmonology': 'from-indigo-100 to-indigo-200',
//     'Pediatrics': 'from-pink-100 to-pink-200',
//     'Infectious Diseases': 'from-yellow-100 to-yellow-200',
//     'General': 'from-gray-100 to-gray-200'
//   };

//   useEffect(() => {
//     console.log("use effect");
//     const token = cookies.get('usertoken');
//     console.log("token from cookie", token);
//     if (token) {
//       console.log("token", token);
//       const fetchUserData = async () => {
//         try {
//           const response = await axios.get('http://localhost:5000/api/user/verify-token', {
//             headers: {
//               Authorization: `Bearer ${token}`
//             },
//             withCredentials: true,
//           });
//           setUserData(response.data.user);
//           console.log("user data", response.data.user);
//           console.log("token", token);
//           console.log("user data", userData);

//            const response1 = await axios.get('http://localhost:5000/api/user/departments', {
//             headers: {
//               Authorization: `Bearer ${token}`
//             },
//             withCredentials: true,
//           });
//           setDepartments(response1.data);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };
//       fetchUserData();
//     }
//   }, []);
  
//   return (
//     <>
//     {userData?(
//      <>
// <div className="py-16 bg-gray-50">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="text-center">
//       <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
//         Our Departments
//       </h2>
//       <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//         Specialized care departments to serve all your healthcare needs
//       </p>
//     </div>

//     <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//       {departments.map((department) => {
//         // Determine icon and gradient based on department name
//         const DepartmentIcon = departmentIcons[department.Departmentname] || FaHospital;
//         const gradientClass = departmentGradients[department.Departmentname] || 'from-gray-100 to-gray-200';
        
//         return (
//           <div
//             key={department._id}
//             className={`relative group bg-gradient-to-br ${gradientClass} overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out`}
//           >
//             <div className="p-6 relative z-10">
//               <div className="flex items-center mb-4">
//                 <DepartmentIcon className="text-4xl text-blue-600 mr-4" />
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {department.Departmentname}
//                 </h3>
//               </div>
//               <p className="text-gray-600 mb-4">
//                 {department.Description}
//               </p>
//             </div>
//             <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center z-20">
//               <button 
//                 onClick={() => navigate(`/book-appointment?department=${department._id}`)}
//                 className="opacity-0 group-hover:opacity-100 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
//               >
//                 Book Appointment
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// </div>
// </>):(<>jdcjdfbjdfb</>)}
     
//      </>
   
//   )
// }

// export default Department;
























import { useEffect, useState } from "react"
// import {
//   FaChild, FaStethoscope, FaUserMd, FaHospital
// }
// from 'react-icons/fa'
import axios from "axios" 
import { useNavigate } from "react-router-dom";
import cookies from 'js-cookie';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate()
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
    {userData?(
     <>

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
    <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {departments.map((department) => (
        <div
          key={department._id}
          className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
        >
          <div className="p-6 relative z-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {department.Departmentname}
            </h3>
            <p className="text-gray-600 mb-4">
              {department.Description}
            </p>
            
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
</>):(<>jdcjdfbjdfb</>)}
     
     </>
   
  )
}

export default Department;





