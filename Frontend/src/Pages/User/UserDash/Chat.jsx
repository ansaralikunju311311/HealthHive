// import React, { useState, useEffect } from 'react';
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
// } from '@mui/material';
// import {
//     Send as SendIcon,
//     Search as SearchIcon,
//     Circle as CircleIcon,
//     AttachFile as AttachFileIcon,
//     EmojiEmotions as EmojiIcon,
// } from '@mui/icons-material';
// import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// const Chat = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { doctorId, userId } = location.state || {};

//     console.log("DoctorDetails==================  inside the  function", location.state)

//     const [selectedDoctor, setSelectedDoctor] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [chat, setChat] = useState([]);
//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         const newSocket = io('http://localhost:5000');
//         setSocket(newSocket);

//         // Handle connection errors
//         newSocket.on('connect_error', (err) => {
//             console.error('Socket connection error:', err);
//         });

//         // Fetch initial chat messages
//         const fetchChat = async () => {
//             const response = await axios.get(`http://localhost:5000/api/user/Chats/${doctorId + userId}`);
//             setChat(response.data);
//         };

//         fetchChat();

//         // Listen for incoming messages
//         newSocket.on('getMessage', (message) => {
//             setChat((prev) => [...prev, message]);
//             scrollToBottom();
//         });

//         return () => {
//             newSocket.disconnect();
//         };
//     }, [doctorId, userId]);

//     const handleSendMessage = async () => {
//         if (!message.trim()) return;

//         const messageData = {
//             roomId: doctorId + userId,
//             doctorId,
//             userId,
//             message
//         };

//         // Emit message to the server
//         socket.emit('sendMessage', messageData);
//         setMessage('');
//     };

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

//     useEffect(() => {
//         const chatDetails = async () => {

//             try {
//                 const response = await axios.get(`http://localhost:5000/api/user/ChatDetails/${doctorId}/${userId}`);
//                 setDoctor(response.data);
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//         chatDetails();
//     }, []);

//     const [doctor, setDoctor] = useState([]);

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
//                 {doctor && doctor.doctor ? (
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
//                                 src={doctor.doctor.profileImage || 'https://via.placeholder.com/80'}
//                                 alt={doctor.doctor.name}
//                                 sx={{ width: 80, height: 80 }}
//                             />
//                             <Box>
//                                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
//                                     {doctor.doctor.name}
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
//                                 {/* Display Messages */}
//                                 {chat.map((msg) => (
//                                     <Box
//                                         key={msg._id}
//                                         sx={{
//                                             alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
//                                             maxWidth: '70%'
//                                         }}
//                                     >
//                                         <Paper sx={{
//                                             p: { xs: 1.5, md: 2 },
//                                             background: msg.sender === 'user'
//                                                 ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
//                                                 : 'white',
//                                             color: msg.sender === 'user' ? 'white' : '#1e293b',
//                                             borderRadius: msg.sender === 'user'
//                                                 ? '20px 20px 5px 20px'
//                                                 : '20px 20px 20px 5px',
//                                             boxShadow: msg.sender === 'user'
//                                                 ? '0 2px 8px rgba(59,130,246,0.3)'
//                                                 : '0 2px 8px rgba(0,0,0,0.05)',
//                                             position: 'relative',
//                                             '&::before': msg.sender === 'user' ? {
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
//                                                     color: msg.sender === 'user'
//                                                         ? 'rgba(255,255,255,0.8)'
//                                                         : '#64748b'
//                                                 }}
//                                             >
//                                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                             </Typography>
//                                         </Paper>
//                                     </Box>
//                                 ))}
//                                 <div ref={messagesEndRef} />
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
//                             Loading Docotr details...
//                         </Typography>
//                     </Box>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default Chat;
// import React from 'react'
// import Sidebar from '../../../Component/User/SideBar/UserSideBAr'
// import {io} from 'socket.io-client';
// const Chat = () => {
//   return (
//     <div>
//         <Sidebar/>
//     </div>
//   )
// }

// export default Chat








import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Sidebar from '../../../Component/Doctor/Sidebar';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import { io } from 'socket.io-client';

const Chat = () => {

   const location = useLocation();
   const navigate = useNavigate();
   const { doctorId, userId } = location.state || {};

   console.log("DoctorDetails==================  inside the  function", location.state)

  const [chat, setChat] = useState([]);
  const [message,setMessage] = useState('');
  const onSend = () => {
    if(message.trim() === '') return; // Avoid empty messages
    console.log('Message sent:');
    socketRef.current.emit('usermessage', { doctorId, userId, message }); // Emit event to backend
    setMessage(''); // Clear input after sending
  };

  const socketRef = useRef(null);

  useEffect(() => {
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

