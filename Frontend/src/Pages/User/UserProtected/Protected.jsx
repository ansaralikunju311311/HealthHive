import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';
import { verifyUserToken } from '../../../Services/userServices/userApiService';

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = cookies.get('usertoken');
        if (!token) {
          navigate('/login');
          return;
        }

        const { user } = await verifyUserToken();
        if (!user) {
          cookies.remove('usertoken', { path: '/' });
          localStorage.removeItem('userId');
          navigate('/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        cookies.remove('usertoken', { path: '/' });
        localStorage.removeItem('userId');
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
