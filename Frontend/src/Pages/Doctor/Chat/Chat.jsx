import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { io } from 'socket.io-client';
import { FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import axios from 'axios';
import TypingIndicator from '../../../Component/Chat/TypingIndicator';
import { userInfo, chatHistory } from '../../../Services/doctorService/doctorService';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import VideoRoom from '../../../Component/VideoCall/VideoRoom';

const Chat = () => {
  const BASE_URL = import.meta.env.VITE_API_URL

  const location = useLocation();
  const navigate = useNavigate();
  const { userId, doctorId,doctorName} = location.state || {};
  const chatContainerRef = useRef(null);

  console.log(location)
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const socketRef = useRef(null);
  const [indication, setIndication] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [roomId, setRoomId] = useState(null);

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

  const initiateVideoCall = () => {
    const newRoomId = `${doctorId}-${userId}-${Date.now()}`;
    setRoomId(newRoomId);
    setIsInCall(true);
    socketRef.current.emit('initiateVideoCall', { doctorId, userId, roomId: newRoomId });
  };

  const endVideoCall = () => {
    setIsInCall(false);
    setRoomId(null);
    socketRef.current.emit('endVideoCall', { doctorId, userId, endedBy: 'doctor' });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userInfo(userId);
        setUser(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchUser();

    const chatData = async () => {
      try {
        const chatDatas = await chatHistory(doctorId, userId);
        console.log("chatDatas", chatDatas);
        setChat(chatDatas);
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    }
    chatData();

    if (!socketRef.current) {
      socketRef.current = io(`${BASE_URL}/chat`, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socketRef.current.emit('joinRoom', { doctorId, userId, type: 'doctor' });
      
      setTimeout(() => {
        socketRef.current.emit('userConnected', { userId: doctorId, type: 'doctor' });
      }, 100);

      socketRef.current.on('connect', () => {
        console.log('Connected to socket', socketRef.current.id);
      });

      socketRef.current.on('usermessage', (data) => {
        console.log("doctor receving message", data);
        console.log("doctor receving datamessage", data);
        const newMessage = {
          sender: 'user',
          message: data,
          timestamp: new Date().toISOString(),
        };
        setChat(prev => [...prev, newMessage]);
      });
      socketRef.current.on('usertyping', ({ isTyping }) => {
        setUserIsTyping(isTyping);
      });

      socketRef.current.on('userStatus', ({ userId: statusUserId, online, type }) => {
        if (statusUserId === userId && type === 'user') {
          setIsUserOnline(online);
          console.log(`User ${userId} is ${online ? 'online' : 'offline'}`);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket');
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
      });

      socketRef.current.on('videoCallAccepted', ({ roomId: acceptedRoomId }) => {
        console.log('Video call accepted:', acceptedRoomId);
      });

      socketRef.current.on('videoCallRejected', () => {
        setIsInCall(false);
        setRoomId(null);
        alert('Video call was rejected');
      });

      socketRef.current.on('videoCallEnded', () => {
        setIsInCall(false);
        setRoomId(null);
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
    socketRef.current.emit("doctortyping", { doctorId, userId, isTyping: true });
    const timeoutId = setTimeout(() => {
      socketRef.current.emit("doctortyping", { doctorId, userId, isTyping: false });
    }, 2000);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-2 md:p-6 w-full md:ml-72">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center space-x-2 md:space-x-4">
            <img src={user.image} alt={user.name} className="w-8 h-8 md:w-12 md:h-12 rounded-full" />
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  isUserOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></span>
                {isUserOnline ? 'Online' : 'Offline'}
                <button
                  onClick={initiateVideoCall}
                  className="ml-4 text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={!isUserOnline}
                >
                  <VideoCallIcon />
                </button>
              </p>
            </div>
          </div>

          {isInCall && roomId && (
            <VideoRoom
              roomId={roomId}
              role="doctor"
              userName={doctorName}
              onCallEnd={endVideoCall}
            />
          )}

          <div ref={chatContainerRef} className="flex-1 p-3 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-3 md:space-y-4">
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
              {userIsTyping && (
                <div className="flex justify-start ml-2">
                  <TypingIndicator />
                </div>
              )}
            </div>
          </div>

          <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-2 md:space-x-4">
              <textarea
                value={message}
                onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
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
