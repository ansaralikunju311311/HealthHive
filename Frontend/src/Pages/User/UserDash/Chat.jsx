import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoctorInfo, getChatHistory,feedBack } from '../../../Services/userServices/userApiService';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import { io } from 'socket.io-client';
import { FiSend } from 'react-icons/fi';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import TypingIndicator from '../../../Component/Chat/TypingIndicator';
import VideoRoom from '../../../Component/VideoCall/VideoRoom';
import { FaStar } from 'react-icons/fa'; 
// import { feedBack } from '../../../Services/userServices/userApiService';
// import { Feedback } from '@mui/icons-material';

const Chat = () => {
  const BASE_URL = import.meta.env.VITE_API_URL
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorId, userId,userName } = location.state || {};
  const chatContainerRef = useRef(null);

  const [chat, setChat] = useState([]);
  const [isTyping,setIsTyping] = useState(false)
  const [message, setMessage] = useState('');
  const [doctor, setDoctor] = useState({});
  const socketRef = useRef(null);
  const [indication,setIndication] = useState(false); 
  const [doctorIsTyping, setDoctorIsTyping] = useState(false);
  const [isDoctorOnline, setIsDoctorOnline] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [incomingCallInfo, setIncomingCallInfo] = useState(null);
  // New states for feedback modal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

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

  const acceptVideoCall = () => {
    if (incomingCallInfo) {
      setRoomId(incomingCallInfo.roomId);
      setIsInCall(true);
      socketRef.current.emit('acceptVideoCall', { 
        doctorId, 
        userId, 
        roomId: incomingCallInfo.roomId 
      });
      setShowCallDialog(false);
      setIncomingCallInfo(null);
    }
  };

  const rejectVideoCall = () => {
    if (incomingCallInfo) {
      socketRef.current.emit('rejectVideoCall', { doctorId, userId });
      setShowCallDialog(false);
      setIncomingCallInfo(null);
    }
  };

  const endVideoCall = () => {
    setIsInCall(false);
    setRoomId(null);
    socketRef.current.emit('endVideoCall', { doctorId, userId, endedBy: 'user' });
    setShowFeedback(true); 
  };

  const handleTyping = () => {
    socketRef.current.emit("usertyping", { doctorId, userId, isTyping: true });

    const timeoutId = setTimeout(() => {
      socketRef.current.emit("usertyping", { doctorId, userId, isTyping: false });
    }, 2000);

    return () => clearTimeout(timeoutId);
  };

  const handleFeedbackSubmit = async () => {
    try {
      // Use a default value if feedbackComment is empty
      console.log('Feedback submitted:', { userId, doctorId, feedbackRating, feedbackComment });

      const response = await feedBack({
        userId,
        doctorId,
        feedbackRating,
        feedbackComment
      });
      setShowFeedback(false);
      setFeedbackRating(0);
      setFeedbackComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleFeedbackStarClick = (star) => {
    setFeedbackRating(star);
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
      socketRef.current = io(BASE_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        path: '/socket.io',
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

      socketRef.current.on('incomingVideoCall', ({ roomId: incomingRoomId }) => {
        setIncomingCallInfo({ roomId: incomingRoomId });
        setShowCallDialog(true);
      });

      socketRef.current.on('videoCallEnded', ({ endedBy }) => {
        setIsInCall(false);
        setRoomId(null);
        if (endedBy === 'doctor') {
          setShowFeedback(true);
        }
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <div className="flex-1 flex flex-col h-screen max-h-screen">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div className="flex items-center space-x-4">
              <img 
                src={doctor.profileImage || 'https://via.placeholder.com/40'} 
                alt="Doctor" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-500"
              />

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {doctor.name || 'Dr. Name'}
                </h3>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    isDoctorOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {isDoctorOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showCallDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Incoming Video Call</h3>
                <p className="mb-6">Dr. {doctor.name} is calling you</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={rejectVideoCall}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Decline
                  </button>
                  <button
                    onClick={acceptVideoCall}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}

          {isInCall && roomId && (
            <VideoRoom
              roomId={roomId}
              role="user"
              userName={userName}
              onCallEnd={endVideoCall}
            />
          )}

          {/* Feedback Modal */}
          {showFeedback && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-xl font-semibold mb-4">Rate Your Call</h3>
                <div className="mb-4">
                  <p className="mb-2">Rating:</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleFeedbackStarClick(star)}
                        className="cursor-pointer"
                      >
                        <FaStar 
                          className={`w-6 h-6 ${feedbackRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="w-full border border-gray-300 rounded p-2"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-3 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-3 md:space-y-4">
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
          <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-2 md:space-x-4">
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
