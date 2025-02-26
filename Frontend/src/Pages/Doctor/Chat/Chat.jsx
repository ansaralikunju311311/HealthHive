



import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { io } from 'socket.io-client';
import { FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import axios from 'axios';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, doctorId } = location.state || {};
  const chatContainerRef = useRef(null);

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const socketRef = useRef(null);
  const [indication,setIndication] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const onSend = () => {
    if (message.trim() === '') return;
    const newMessage = {
      sender: 'doctor',
      message: message,
      timestamp: new Date().toISOString(),
    };
    setChat(prev => [...prev, newMessage]);
    socketRef.current.emit('drmessage', { doctorId, userId, message });
    setMessage('');
  };

  useEffect(() => {


    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/userinfo/${userId}`);
        setUser(response.data);
        console.log("===========================user user",response.data)
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchUser();




    const chatData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/Chats/${doctorId}/${userId}`);
        setChat(response.data);
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    }
    chatData();
















    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socketRef.current.emit('joinRoom', { doctorId, userId });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket', socketRef.current.id);
      });

      socketRef.current.on('usermessage', (data) => {
        console.log("doctor receving message",data);
        console.log("doctor receving datamessage",data);
        const newMessage = {
          sender: 'user',
          message: data,
          timestamp: new Date().toISOString(),
        };
        setChat(prev => [...prev, newMessage]);
      });
      socketRef.current.on('typing', (data) => {
        console.log("from the doctor ",data)
        setIndication(data)
        if (data) {
          setTimeout(() => {
            setIndication(false);
          }, 2000);
        }
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
        socketRef.current = null;
      }
    };
  }, [userId, doctorId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-72 p-6">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          {/* <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full" />
            <p>patient</p>

          </div> */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-4">
    <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full" />
    <div>
        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
        <p className="text-gray-500 text-sm">Patient</p>
    </div>
</div>

          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4">
              {chat.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${
                    msg.sender === 'doctor'
                      ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg'
                  } px-4 py-3 shadow-sm`}>
                    <p className="text-sm">{msg.message}</p>
                    <span className={`text-xs ${
                      msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                    } block mt-1`}>
                      {/* {format(new Date(msg.timestamp), 'HH:mm')} */}
                    </span>



                   

                  </div>
                </div>
              ))}
               {indication && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm">
                is typing...
              </div>
            </div>
          )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder="Type your message..."
                rows="1"
                className="flex-1 resize-none rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-sm"
              />
              <button 
                onClick={onSend}
                disabled={!message.trim()}
                className={`p-3 rounded-lg ${
                  message.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                } transition-colors duration-200`}
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
