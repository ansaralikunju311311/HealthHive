import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';

const DoctorReve = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get('doctoraccessToken');
    if (token) {
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default DoctorReve;
