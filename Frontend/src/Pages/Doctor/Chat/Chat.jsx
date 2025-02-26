// import React, { useEffect, useState } from 'react';
// import {
//     Box,
//     Paper,
//     Typography,
//     TextField,
//     IconButton,
//     Avatar,
//     List,
//     ListItem,
//     ListItemAvatar,
//     ListItemText,
//     Divider,
//     Badge,
//     InputAdornment,
//     Chip,
// } from '@mui/material';
// import {
//     Send as SendIcon,
//     Search as SearchIcon,
//     AttachFile as AttachFileIcon,
//     EmojiEmotions as EmojiIcon,
//     MoreVert as MoreVertIcon,
//     Circle as CircleIcon,
// } from '@mui/icons-material';
// import Sidebar from '../../../Component/Doctor/Sidebar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// const Chat = () => {
//     const location = useLocation();
//     const { userId, doctorId } = location.state || {};
//     const navigate = useNavigate();
//     const [message, setMessage] = useState('');
//     const [user, setUser] = useState(null);
//     const [chat, setChat] = useState([]);
//     const messagesEndRef = React.useRef(null);

//     const scrollToBottom = () => {
//         if (messagesEndRef.current) {
//             const messageContainer = messagesEndRef.current.parentElement;
//             messageContainer.scrollTop = messageContainer.scrollHeight;
//         }
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [chat]);

//     const handleSendMessage = async() => {
//         if (!message.trim()) return;

//         try {
//             await axios.post('http://localhost:5000/api/doctor/sendmessage', {
//                 roomId : doctorId+userId,
//                 doctorId,
//                 userId,
//                 message
//             });
            
//             // Fetch updated chat messages after sending
//             const chatResponse = await axios.get(`http://localhost:5000/api/doctor/Chats/${doctorId+userId}`);
//             setChat(chatResponse.data);
//             setMessage('');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };
//     // Dummy data for patients

   




//     useEffect(() => {
//         const showChat = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/doctor/Chats/${doctorId+userId}`);
//                 setChat(response.data);
//             } catch (error) {
//                 console.error('Error fetching chat:', error);
//             }
//         };
//         showChat();
//         const interval = setInterval(showChat, 1000);
//         return () => clearInterval(interval);
//     }, [doctorId, userId]);


//     console.log("kfkkfkfkfk",message)
//     console.log("=======  will doctor",userId,doctorId)
//     useEffect(()=>
//     {
//         const chatDetails = async () => {
//             // console.log("DoctorDetails==================  inside the  function");
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/doctor/ChatDetails/${doctorId}/${userId}`);
//                 setUser(response.data);
//                 console.log("=======  will doctor",response.data)
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//         chatDetails();        
//     },[])
//     // useEffect(()=>{
//     //     setMessages(messages)
//     // })
//     return (
//         <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#EEF2F6' }}>
//             <Sidebar activePage="Chat" />
//             <Box sx={{ 
//                 flex: 1, 
//                 p: { xs: 2, md: 3 }, 
//                 display: 'flex', 
//                 flexDirection: 'column',
//                 maxWidth: '1400px',
//                 mx: 'auto',
//                 width: '100%'
//             }}>
//                 {user ? (
//                     <>
//                         {/* User Info Header */}
//                         <Paper sx={{ 
//                             p: { xs: 2, md: 3 },
//                             mb: 3,
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: { xs: 2, md: 3 },
//                             borderRadius: '16px',
//                             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//                             background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
//                         }}>
//                             <Avatar 
//                                 src={user.user.image || 'https://via.placeholder.com/80'} 
//                                 alt={user.user.name}
//                                 sx={{ width: 80, height: 80 }}
//                             />
//                             <Box>
//                                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
//                                     {user.user.name}
//                                 </Typography>
//                                 <Typography variant="subtitle1" sx={{ color: '#64748b' }}>
//                                     Patient
//                                 </Typography>
//                             </Box>
//                             <Badge
//                                 overlap="circular"
//                                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                                 variant="dot"
//                                 sx={{
//                                     ml: 'auto',
//                                     '& .MuiBadge-badge': {
//                                         backgroundColor: '#22c55e'
//                                     }
//                                 }}
//                             >
//                                 <Typography variant="body2" sx={{ color: '#64748b' }}>Online</Typography>
//                             </Badge>
//                         </Paper>

//                         {/* Chat Area */}
//                         <Paper sx={{ 
//                             flex: 1,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             borderRadius: '16px',
//                             boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//                             overflow: 'hidden',
//                             background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
//                             backdropFilter: 'blur(10px)'
//                         }}>
//                             {/* Messages */}
//                             <Box sx={{ 
//                                 flex: 1,
//                                 p: { xs: 2, md: 3 },
//                                 overflowY: 'auto',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 gap: 2.5,
//                                 bgcolor: '#f8fafc',
//                                 maxHeight: 'calc(100vh - 280px)', // Fixed height for message container
//                                 '&::-webkit-scrollbar': {
//                                     width: '8px',
//                                     background: 'transparent'
//                                 },
//                                 '&::-webkit-scrollbar-thumb': {
//                                     background: '#CBD5E1',
//                                     borderRadius: '8px',
//                                     '&:hover': {
//                                         background: '#94A3B8'
//                                     }
//                                 }
//                             }}>
//                                 <div ref={messagesEndRef} />
//                                 {/* Display Messages */}
//                                 {chat.map((msg) => (
//                                     <Box 
//                                         key={msg._id}
//                                         sx={{ 
//                                             alignSelf: msg.senderId === doctorId ? 'flex-end' : 'flex-start',
//                                             maxWidth: '70%'
//                                         }}
//                                     >
//                                         <Paper sx={{ 
//                                             p: { xs: 1.5, md: 2 },
//                                             background: msg.senderId === doctorId 
//                                                 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
//                                                 : 'white',
//                                             color: msg.senderId === doctorId ? 'white' : '#1e293b',
//                                             borderRadius: msg.senderId === doctorId
//                                                 ? '20px 20px 5px 20px'
//                                                 : '20px 20px 20px 5px',
//                                             boxShadow: msg.senderId === doctorId
//                                                 ? '0 2px 8px rgba(59,130,246,0.3)'
//                                                 : '0 2px 8px rgba(0,0,0,0.05)',
//                                             position: 'relative',
//                                             '&::before': msg.senderId === doctorId ? {
//                                                 content: '""',
//                                                 position: 'absolute',
//                                                 right: '-8px',
//                                                 bottom: 0,
//                                                 width: '20px',
//                                                 height: '20px',
//                                                 background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//                                                 clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
//                                             } : {
//                                                 content: '""',
//                                                 position: 'absolute',
//                                                 left: '-8px',
//                                                 bottom: 0,
//                                                 width: '20px',
//                                                 height: '20px',
//                                                 background: 'white',
//                                                 clipPath: 'polygon(0 0, 100% 100%, 100% 0)'
//                                             }
//                                         }}>
//                                             <Typography variant="body1">{msg.message}</Typography>
//                                             <Typography 
//                                                 variant="caption" 
//                                                 sx={{ 
//                                                     display: 'block', 
//                                                     textAlign: 'right', 
//                                                     mt: 1, 
//                                                     color: msg.senderId === doctorId 
//                                                         ? 'rgba(255,255,255,0.8)' 
//                                                         : '#64748b'
//                                                 }}
//                                             >
//                                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                             </Typography>
//                                         </Paper>
//                                     </Box>
//                                 ))}
//                             </Box>

//                             {/* Message Input */}
//                             <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
//                                 <TextField
//                                     fullWidth
//                                     placeholder="Type a message..."
//                                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <IconButton size="small">
//                                                     <EmojiIcon sx={{ color: '#64748b' }} />
//                                                 </IconButton>
//                                                 <IconButton size="small">
//                                                     <AttachFileIcon sx={{ color: '#64748b' }} />
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         ),
//                                         endAdornment: (
//                                             <InputAdornment position="end">
//                                                 <IconButton
//                                                     onClick={handleSendMessage}
//                                                     sx={{
//                                                         bgcolor: message.trim() ? '#3b82f6' : '#e2e8f0',
//                                                         color: 'white',
//                                                         '&:hover': {
//                                                             bgcolor: message.trim() ? '#2563eb' : '#e2e8f0'
//                                                         }
//                                                     }}
//                                                 >
//                                                     <SendIcon />
//                                                 </IconButton>
//                                             </InputAdornment>
//                                         ),
//                                         sx: {
//                                             bgcolor: '#f8fafc',
//                                             borderRadius: 3,
//                                             '& .MuiOutlinedInput-notchedOutline': {
//                                                 borderColor: '#e2e8f0'
//                                             }
//                                         }
//                                     }}
//                                 />
//                             </Box>
//                         </Paper>
//                     </>
//                 ) : (
//                     <Box sx={{ 
//                         flex: 1,
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center'
//                     }}>
//                         <Typography variant="h5" sx={{ color: '#64748b' }}>
//                             Loading patient details...
//                         </Typography>
//                     </Box>
//                 )}
//             </Box>
//         </Box>



//     );
// };

// export default Chat;






// import React, { useEffect } from 'react';
// import Sidebar from '../../../Component/Doctor/Sidebar';
// import { io } from 'socket.io-client';

// const Chat = () => {
//   const socket = io('http://localhost:5000', {
//     withCredentials: true,
//     transports: ['websocket', 'polling'], // Ensure proper transport
//   });

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Connected to socket', socket.id);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from socket');
//     });

//     socket.on('connect_error', (err) => {
//       console.error('Connection error:', err.message);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <Sidebar />
//     </div>
//   );
// };

// export default Chat;




// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Sidebar from '../../../Component/Doctor/Sidebar';
// import { io } from 'socket.io-client';

// const Chat = () => {
//   const location = useLocation();
//   const { userId, doctorId } = location.state || {};



//   console.log("DoctorDetails==================  inside the  function", doctorId, userId)
//   const navigate = useNavigate();
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState('');
//   // const onSend = () => {
//   //   console.log('Message sent:');
//   // };


//   const onSend = () => {
//     if (message.trim() === '') return; // Avoid empty messages
//     console.log('Message sent:', message);
//     socketRef.current.emit('drmessage', { doctorId, userId, message }); // Emit event to backend
//     setMessage(''); // Clear input after sending
//   };

//   const socketRef = useRef(null);

//   useEffect(() => {
//     // Initialize socket only if it's not already initialized
//     if (!socketRef.current) { 
//       socketRef.current = io('http://localhost:5000', {
//         withCredentials: true,
//         transports: ['websocket', 'polling'],
//       });

//       socketRef.current.emit('joinRoom', { doctorId, userId });

//       socketRef.current.on('connect', () => {
//         console.log('Connected to socket', socketRef.current.id);
//       });
//       socketRef.current.on('usermessage',(data)=>
//       {
//         console.log(data);
//         setChat((prevChat) => [...prevChat, data]);  // Append new message
//       })

//       socketRef.current.on('disconnect', () => {
//         console.log('Disconnected from socket');
//       });

//       socketRef.current.on('connect_error', (err) => {
//         console.error('Connection error:', err.message);
//       });
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         console.log('Socket manually disconnected');
//         socketRef.current = null; // Reset ref
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <Sidebar />
//       <input type="text" 
//       value={message}
//       onChange={(e) => setMessage(e.target.value)}/>
//       <button
//       onClick={onSend}>onSend</button>
//       {chat.map((msg, index) => (
//         <div key={index} className='text-black height'>
//           <p>{msg}{JSON.stringify(msg)}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Chat;




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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const onSend = () => {
    if (message.trim() === '') return;
    const newMessage = {
      sender: 'doctor',
      content: message,
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
          content: data,
          timestamp: new Date().toISOString(),
        };
        setChat(prev => [...prev, newMessage]);
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
                    <p className="text-sm">{msg.content}</p>
                    <span className={`text-xs ${
                      msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
                    } block mt-1`}>
                      {format(new Date(msg.timestamp), 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
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
