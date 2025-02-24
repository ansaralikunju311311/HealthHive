import React, { useEffect, useState } from 'react';
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
    Chip,
} from '@mui/material';
import {
    Send as SendIcon,
    Search as SearchIcon,
    AttachFile as AttachFileIcon,
    EmojiEmotions as EmojiIcon,
    MoreVert as MoreVertIcon,
    Circle as CircleIcon,
} from '@mui/icons-material';
import Sidebar from '../../../Component/Doctor/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Chat = () => {
    const location = useLocation();
    const { userId, doctorId } = location.state || {};
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [chat, setChat] = useState([]);
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const messageContainer = messagesEndRef.current.parentElement;
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSendMessage = async() => {
        if (!message.trim()) return;

        try {
            await axios.post('http://localhost:5000/api/doctor/sendmessage', {
                roomId : doctorId+userId,
                doctorId,
                userId,
                message
            });
            
            // Fetch updated chat messages after sending
            const chatResponse = await axios.get(`http://localhost:5000/api/doctor/Chats/${doctorId+userId}`);
            setChat(chatResponse.data);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    // Dummy data for patients

   




    useEffect(() => {
        const showChat = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctor/Chats/${doctorId+userId}`);
                setChat(response.data);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };
        showChat();
        const interval = setInterval(showChat, 1000);
        return () => clearInterval(interval);
    }, [doctorId, userId]);


    console.log("kfkkfkfkfk",message)
    console.log("=======  will doctor",userId,doctorId)
    useEffect(()=>
    {
        const chatDetails = async () => {
            // console.log("DoctorDetails==================  inside the  function");
            try {
                const response = await axios.get(`http://localhost:5000/api/doctor/ChatDetails/${doctorId}/${userId}`);
                setUser(response.data);
                console.log("=======  will doctor",response.data)
            } catch (error) {
                console.log(error)
            }
        }
        chatDetails();        
    },[])
    // useEffect(()=>{
    //     setMessages(messages)
    // })
    return (
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
                {user ? (
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
                                src={user.user.image || 'https://via.placeholder.com/80'} 
                                alt={user.user.name}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                                    {user.user.name}
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
                                maxHeight: 'calc(100vh - 280px)', // Fixed height for message container
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
                                <div ref={messagesEndRef} />
                                {/* Display Messages */}
                                {chat.map((msg) => (
                                    <Box 
                                        key={msg._id}
                                        sx={{ 
                                            alignSelf: msg.senderId === doctorId ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%'
                                        }}
                                    >
                                        <Paper sx={{ 
                                            p: { xs: 1.5, md: 2 },
                                            background: msg.senderId === doctorId 
                                                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                                                : 'white',
                                            color: msg.senderId === doctorId ? 'white' : '#1e293b',
                                            borderRadius: msg.senderId === doctorId
                                                ? '20px 20px 5px 20px'
                                                : '20px 20px 20px 5px',
                                            boxShadow: msg.senderId === doctorId
                                                ? '0 2px 8px rgba(59,130,246,0.3)'
                                                : '0 2px 8px rgba(0,0,0,0.05)',
                                            position: 'relative',
                                            '&::before': msg.senderId === doctorId ? {
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
                                            <Typography variant="body1">{msg.message}</Typography>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    display: 'block', 
                                                    textAlign: 'right', 
                                                    mt: 1, 
                                                    color: msg.senderId === doctorId 
                                                        ? 'rgba(255,255,255,0.8)' 
                                                        : '#64748b'
                                                }}
                                            >
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                            Loading patient details...
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>



    );
};

export default Chat;