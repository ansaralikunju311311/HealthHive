import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoctorInfo, getChatHistory } from '../../../Services/apiService';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import { io } from 'socket.io-client';
import { FiSend } from 'react-icons/fi';
import TypingIndicator from '../../../Component/Chat/TypingIndicator';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorId, userId } = location.state || {};
  const chatContainerRef = useRef(null);

  const [chat, setChat] = useState([]);
  const [isTyping,setIsTyping] = useState(false)
  const [message, setMessage] = useState('');
  const [doctor, setDoctor] = useState({});
  const socketRef = useRef(null);
  const [indication,setIndication] = useState(false); 
  const [doctorIsTyping, setDoctorIsTyping] = useState(false);
  const [isDoctorOnline, setIsDoctorOnline] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const onSend = () => {
    if (message.trim() === '') return;
    const newMessage = {
      sender: 'user',
      message: message,
      timestamp: new Date().toISOString(),
    };
    setChat(prev => [...prev, newMessage]);
    socketRef.current.emit('usermessage', { doctorId, userId, message });
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorData, chatHistory] = await Promise.all([
          getDoctorInfo(doctorId),
          getChatHistory(doctorId, userId)
        ]);
        setDoctor(doctorData);
        setChat(chatHistory);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socketRef.current.emit('joinRoom', { doctorId, userId, type: 'user' });
      
      setTimeout(() => {
        socketRef.current.emit('userConnected', { userId, type: 'user' });
      }, 100);

      socketRef.current.on('connect', () => {
        console.log('Connected to socket', socketRef.current.id);
      });

      socketRef.current.on('drmessage', (data) => {
        const newMessage = {
          sender: 'doctor',
          message: data,
          timestamp: new Date().toISOString(),
        };
        setChat(prev => [...prev, newMessage]);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket');
      });

      socketRef.current.on('doctortyping', ({ isTyping }) => {
        setDoctorIsTyping(isTyping);
      });

      socketRef.current.on('userStatus', ({ userId: statusUserId, online, type }) => {
        if (statusUserId === doctorId && type === 'doctor') {
          setIsDoctorOnline(online);
          console.log(`Doctor ${doctorId} is ${online ? 'online' : 'offline'}`);
        }
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

  const handleTyping = () => {
    socketRef.current.emit("usertyping", { doctorId, userId, isTyping: true });

    const timeoutId = setTimeout(() => {
      socketRef.current.emit("usertyping", { doctorId, userId, isTyping: false });
    }, 2000);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-72 p-6">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img 
                src={doctor.profileImage || 'https://via.placeholder.com/40'} 
                alt="Doctor" 
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {doctor.name || 'Dr. Name'}
                </h3>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    isDoctorOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-sm text-gray-600">
                    {isDoctorOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-4">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg' 
                      : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg'
                  } px-4 py-3 shadow-sm`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <span className={`text-xs ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    } block mt-1`}>
                      {/* {format(new Date(msg.timestamp), 'HH:mm')} */}
                    </span>
                  </div>
                </div>
              ))}
              {doctorIsTyping && (
                <div className="flex justify-start ml-2">
                  <TypingIndicator />
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-4">
              <textarea
                value={message}
                onChange={(e) => {setMessage(e.target.value);
                  handleTyping()}}
                onKeyPress={handleKeyPress}
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
