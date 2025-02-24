import React, { useState ,useEffect} from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Badge,
    InputAdornment,
} from '@mui/material';
import {
    Send as SendIcon,
    Search as SearchIcon,
    Circle as CircleIcon,
    AttachFile as AttachFileIcon,
    EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import Sidebar from '../../../Component/User/SideBar/UserSideBAr';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const DoctorDetails = location.state;
    console.log("DoctorDetails",DoctorDetails); 
    const {doctorId} = DoctorDetails;
    console.log("doctorId",doctorId);
    const {userId} = DoctorDetails;
    console.log("userId",userId);
     
    



    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');





    const handleSendMessage = async() => {
        if (!message.trim()) return;


       
        const newMessage = {
            id: Date.now(),
            sender: 'doctor',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Send the message to the server
        try {
            const response = await axios.post('http://localhost:5000/api/user/sendmessage', {
                roomId : doctorId+userId,
                doctorId,
                userId,
                message
            });
            console.log('Message sent:', response.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };





    const [doctor, setDoctor] = useState([]);
useEffect(()=>
{
    console.log("DoctorDetails==================  inside the useeffect ");
    const chatDetails = async () => {
        // console.log("DoctorDetails==================  inside the  function");
        try {
            const response = await axios.get(`http://localhost:5000/api/user/ChatDetails/${DoctorDetails.doctorId}/${DoctorDetails.userId}`);
            setDoctor(response.data);
            console.log("=======  will doctor",response.data)
        } catch (error) {
            console.log(error)
        }
    }
    chatDetails();
},[]);
    



    


  
    return (
        
        

     
    //  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#EEF2F6' }}>
    //     <Sidebar/>
    //     <Box sx={{ 
    //         flex: 1, 
    //         p: { xs: 2, md: 3 }, 
    //         display: 'flex', 
    //         flexDirection: 'column',
    //         maxWidth: '1400px',
    //         mx: 'auto',
    //         width: '100%'
    //     }}>
    //         {doctor && doctor.doctor ? (
    //             <>
    //                 {/* Doctor Info Header */}
    //                 <Paper sx={{ 
    //                     p: { xs: 2, md: 3 },
    //                     mb: 3,
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                     gap: { xs: 2, md: 3 },
    //                     borderRadius: '16px',
    //                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    //                     background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
    //                 }}>
    //                     <Avatar 
    //                         src={doctor.doctor.profileImage} 
    //                         alt={doctor.doctor.name}
    //                         sx={{ width: 80, height: 80 }}
    //                     />
    //                     <Box>
    //                         <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
    //                             {doctor.doctor.name}
    //                         </Typography>
    //                         <Typography variant="subtitle1" sx={{ color: '#64748b' }}>
    //                             {doctor.doctor.specialization}
    //                         </Typography>
    //                     </Box>
    //                     <Badge
    //                         overlap="circular"
    //                         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //                         variant="dot"
    //                         sx={{
    //                             ml: 'auto',
    //                             '& .MuiBadge-badge': {
    //                                 backgroundColor: '#22c55e'
    //                             }
    //                         }}
    //                     >
    //                         <Typography variant="body2" sx={{ color: '#64748b' }}>Online</Typography>
    //                     </Badge>
    //                 </Paper>

    //                 {/* Chat Area */}
    //                 <Paper sx={{ 
    //                     flex: 1,
    //                     display: 'flex',
    //                     flexDirection: 'column',
    //                     borderRadius: '16px',
    //                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    //                     overflow: 'hidden',
    //                     background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    //                     backdropFilter: 'blur(10px)'
    //                 }}>
    //                     {/* Messages */}
    //                     <Box sx={{ 
    //                         flex: 1,
    //                         p: { xs: 2, md: 3 },
    //                         overflowY: 'auto',
    //                         display: 'flex',
    //                         flexDirection: 'column',
    //                         gap: 2.5,
    //                         bgcolor: '#f8fafc',
    //                         '&::-webkit-scrollbar': {
    //                             width: '8px',
    //                             background: 'transparent'
    //                         },
    //                         '&::-webkit-scrollbar-thumb': {
    //                             background: '#CBD5E1',
    //                             borderRadius: '8px',
    //                             '&:hover': {
    //                                 background: '#94A3B8'
    //                             }
    //                         }
    //                     }}>
    //                         {/* Example Messages */}
    //                         <Box sx={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
    //                             <Paper sx={{ 
    //                                 p: { xs: 1.5, md: 2 },
    //                                 bgcolor: 'white',
    //                                 borderRadius: '20px 20px 20px 5px',
    //                                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    //                                 position: 'relative',
    //                                 '&::before': {
    //                                     content: '""',
    //                                     position: 'absolute',
    //                                     left: '-8px',
    //                                     bottom: 0,
    //                                     width: '20px',
    //                                     height: '20px',
    //                                     background: 'white',
    //                                     clipPath: 'polygon(0 0, 100% 100%, 100% 0)'
    //                                 }
    //                             }}>
    //                                 {/* <Typography variant="body1">Hello! How can I help you today?</Typography>
    //                                 <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, color: '#64748b' }}>
    //                                     10:00 AM
    //                                 </Typography> */}
    //                             </Paper>
    //                         </Box>

    //                         <Box sx={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
    //                             <Paper sx={{ 
    //                                 p: { xs: 1.5, md: 2 },
    //                                 background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    //                                 color: 'white',
    //                                 borderRadius: '20px 20px 5px 20px',
    //                                 boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
    //                                 position: 'relative',
    //                                 '&::before': {
    //                                     content: '""',
    //                                     position: 'absolute',
    //                                     right: '-8px',
    //                                     bottom: 0,
    //                                     width: '20px',
    //                                     height: '20px',
    //                                     background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    //                                     clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
    //                                 }
    //                             }}>
    //                                 {/* <Typography variant="body1">Hi doctor, I have a question about my prescription.</Typography>
    //                                 <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, color: 'rgba(255,255,255,0.8)' }}>
    //                                     10:02 AM
    //                                 </Typography> */}
    //                             </Paper>
    //                         </Box>
    //                     </Box>

    //                     {/* Message Input */}
    //                     <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
    //                         <TextField
    //                             // onClick={handleSendMessage}
    //                             fullWidth
    //                             placeholder="Type a message..."
    //                             value={message}
    //                             onChange={(e) => setMessage(e.target.value)}
    //                             InputProps={{
    //                                 startAdornment: (
    //                                     <InputAdornment position="start">
    //                                         <IconButton size="small">
    //                                             <EmojiIcon sx={{ color: '#64748b' }} />
    //                                         </IconButton>
    //                                         <IconButton size="small">
    //                                             <AttachFileIcon sx={{ color: '#64748b' }} />
    //                                         </IconButton>
    //                                     </InputAdornment>
    //                                 ),
    //                                 endAdornment: (
    //                                     <InputAdornment position="end">
    //                                         <IconButton
    //                                             sx={{
    //                                                 bgcolor: '#3b82f6',
    //                                                 color: 'white',
    //                                                 '&:hover': { bgcolor: '#2563eb' }
    //                                             }}
    //                                         >
    //                                             <SendIcon />
    //                                         </IconButton>
    //                                     </InputAdornment>
    //                                 ),
    //                                 sx: {
    //                                     bgcolor: '#f8fafc',
    //                                     borderRadius: 3,
    //                                     '& .MuiOutlinedInput-notchedOutline': {
    //                                         borderColor: '#e2e8f0'
    //                                     }
    //                                 }
    //                             }}
    //                         />
    //                     </Box>
    //                 </Paper>
    //             </>
    //         ) : (
    //             <Box sx={{ 
    //                 flex: 1,
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center'
    //             }}>
    //                 <Typography variant="h5" sx={{ color: '#64748b' }}>
    //                     Loading doctor details...
    //                 </Typography>
    //             </Box>
    //         )}
    //     </Box>
    //  </Box>


    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#EEF2F6' }}>
    <Sidebar activePage="Chat" />
    <Box sx={{ 
        flex: 1, 
        p: { xs: 2, md: 3 }, 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '1400px',
        mx: 'auto',
        width: '100%'
    }}>
        {doctor && doctor.doctor? (
            <>
                {/* User Info Header */}
                <Paper sx={{ 
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
                }}>
                    <Avatar 
                        src={doctor.doctor.profileImage|| 'https://via.placeholder.com/80'} 
                        alt={doctor.doctor.name}
                        sx={{ width: 80, height: 80 }}
                    />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                            {doctor.doctor.name}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>
                            Patient
                        </Typography>
                    </Box>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                            ml: 'auto',
                            '& .MuiBadge-badge': {
                                backgroundColor: '#22c55e'
                            }
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Online</Typography>
                    </Badge>
                </Paper>

                {/* Chat Area */}
                <Paper sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    backdropFilter: 'blur(10px)'
                }}>
                    {/* Messages */}
                    <Box sx={{ 
                        flex: 1,
                        p: { xs: 2, md: 3 },
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                        bgcolor: '#f8fafc',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            background: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#CBD5E1',
                            borderRadius: '8px',
                            '&:hover': {
                                background: '#94A3B8'
                            }
                        }
                    }}>
                        {/* Display Messages */}
                        {messages.map((msg) => (
                            <Box 
                                key={msg.id}
                                sx={{ 
                                    alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%'
                                }}
                            >
                                <Paper sx={{ 
                                    p: { xs: 1.5, md: 2 },
                                    background: msg.sender === 'doctor' 
                                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                        : 'white',
                                    color: msg.sender === 'doctor' ? 'white' : '#1e293b',
                                    borderRadius: msg.sender === 'doctor'
                                        ? '20px 20px 5px 20px'
                                        : '20px 20px 20px 5px',
                                    boxShadow: msg.sender === 'doctor'
                                        ? '0 2px 8px rgba(59,130,246,0.3)'
                                        : '0 2px 8px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    '&::before': msg.sender === 'doctor' ? {
                                        content: '""',
                                        position: 'absolute',
                                        right: '-8px',
                                        bottom: 0,
                                        width: '20px',
                                        height: '20px',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
                                    } : {
                                        content: '""',
                                        position: 'absolute',
                                        left: '-8px',
                                        bottom: 0,
                                        width: '20px',
                                        height: '20px',
                                        background: 'white',
                                        clipPath: 'polygon(0 0, 100% 100%, 100% 0)'
                                    }
                                }}>
                                    <Typography variant="body1">{msg.text}</Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            display: 'block', 
                                            textAlign: 'right', 
                                            mt: 1, 
                                            color: msg.sender === 'doctor' 
                                                ? 'rgba(255,255,255,0.8)' 
                                                : '#64748b'
                                        }}
                                    >
                                        {msg.time}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>

                    {/* Message Input */}
                    <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                        <TextField
                            fullWidth
                            placeholder="Type a message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton size="small">
                                            <EmojiIcon sx={{ color: '#64748b' }} />
                                        </IconButton>
                                        <IconButton size="small">
                                            <AttachFileIcon sx={{ color: '#64748b' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSendMessage}
                                            sx={{
                                                bgcolor: message.trim() ? '#3b82f6' : '#e2e8f0',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: message.trim() ? '#2563eb' : '#e2e8f0'
                                                }
                                            }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    bgcolor: '#f8fafc',
                                    borderRadius: 3,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#e2e8f0'
                                    }
                                }
                            }}
                        />
                    </Box>
                </Paper>
            </>
        ) : (
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ color: '#64748b' }}>
                    Loading Docotr details...
                </Typography>
            </Box>
        )}
    </Box>
</Box>













    );
};

export default Chat;