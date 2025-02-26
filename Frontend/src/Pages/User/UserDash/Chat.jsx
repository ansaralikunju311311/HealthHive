




import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Sidebar from '../../../Component/Doctor/Sidebar';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import { io } from 'socket.io-client';
import axios from 'axios';

const Chat = () => {

   const location = useLocation();
   const navigate = useNavigate();
   const { doctorId, userId } = location.state || {};

   console.log("DoctorDetails==================  inside the  function", location.state)

  const [chat, setChat] = useState([]);
  const [message,setMessage] = useState('');
  const [doctor, setDoctor] = useState({});
  const onSend = () => {
    if(message.trim() === '') return; // Avoid empty messages
    console.log('Message sent:');
    socketRef.current.emit('usermessage', { doctorId, userId, message }); // Emit event to backend
    setMessage(''); // Clear input after sending
  };

  const socketRef = useRef(null);

  useEffect(() => {
   

   console.log('wornfjnfjkn')
    const fetchDoctor = async () => {
      console.log('Fetching doctor details...');
      try {
        const response = await axios.get(`http://localhost:5000/api/user/doctorinfo/${doctorId}`);
        setDoctor(response.data);
        console.log('Doctor details:mfmfmfmmfmfmgmf gmgmgnmfngmnmgnmngmfngmfgnfmngmfgnfm', response.data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchDoctor();

    // Initialize socket only if it's not already initialized
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socketRef.current.emit('joinRoom', { doctorId, userId });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket', socketRef.current.id);
      });
      socketRef.current.on('drmessage', (data) => {
        console.log('Message received:', data);
        setChat((prevChat) => [...prevChat, data]);  // Append new message
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket');
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket manually disconnected');
        socketRef.current = null; // Reset ref
      }
    };
  }, [userId,doctorId]);

  return (
    <div>
      <Sidebar />
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={onSend}>Send</button>
      {/* <input type="text" /> */}
      
      {/* <button onClick={onSend}>onSend</button> */}
      <div>
        {chat.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
