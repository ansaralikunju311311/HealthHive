import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReverseProtected = ({children}) => {
    const navigate = useNavigate();
    useEffect(()=>
    {
        const token = localStorage.getItem('admintoken');
        if(token)
        {
            navigate('/admin');
        }
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('admintoken');
                if (!token) {
                    navigate('/admin');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/admin/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.data.admin) {
                    navigate('/admin-dashboard');
                } else {
                    localStorage.removeItem('admintoken');
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('admintoken');
                navigate('/admin');
            }
        }
        verifyToken();
    }, []);
  return (
    <div>
      {children}
    </div>
  )
}

export default ReverseProtected
