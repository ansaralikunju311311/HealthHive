import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';

const Protected = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get('useraccessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default Protected;
