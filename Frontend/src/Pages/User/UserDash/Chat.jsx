import React, { useState } from 'react';
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

const Chat = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data for doctors
    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            online: true,
            lastMessage: 'Thank you for your consultation',
            unread: 2,
            lastSeen: '2 min ago'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Neurologist',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            online: false,
            lastMessage: 'Please take the prescribed medicine',
            unread: 0,
            lastSeen: '1 hour ago'
        },
        // Add more doctors as needed
    ];

    // Dummy messages
    const messages = [
        {
            id: 1,
            sender: 'doctor',
            text: 'Hello! How can I help you today?',
            time: '10:00 AM'
        },
        {
            id: 2,
            sender: 'user',
            text: 'Hi doctor, I have been experiencing headaches lately',
            time: '10:02 AM'
        },
        {
            id: 3,
            sender: 'doctor',
            text: 'I understand. How long have you been having these headaches?',
            time: '10:03 AM'
        },
        // Add more messages as needed
    ];

    const handleSendMessage = () => {
        if (message.trim()) {
            // Add logic to send message
            setMessage('');
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Sidebar />
            
            <Box sx={{ flex: 1, p: 3 }}>
                <Paper sx={{ 
                    display: 'flex', 
                    height: 'calc(100vh - 100px)',
                    overflow: 'hidden',
                    borderRadius: 3,
                    bgcolor: 'white',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                    {/* Doctors List */}
                    <Box sx={{ 
                        width: 320, 
                        borderRight: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 'bold' }}>
                                Messages
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search doctors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#64748b' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: '#f1f5f9'
                                    }
                                }}
                            />
                        </Box>

                        <List sx={{ 
                            overflow: 'auto',
                            flex: 1,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#cbd5e1',
                                borderRadius: '4px',
                            }
                        }}>
                            {doctors.map((doctor) => (
                                <React.Fragment key={doctor.id}>
                                    <ListItem 
                                        button 
                                        selected={selectedDoctor?.id === doctor.id}
                                        onClick={() => setSelectedDoctor(doctor)}
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            '&.Mui-selected': {
                                                bgcolor: '#e2e8f0',
                                                '&:hover': {
                                                    bgcolor: '#e2e8f0'
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                variant="dot"
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        bgcolor: doctor.online ? '#22c55e' : '#94a3b8'
                                                    }
                                                }}
                                            >
                                                <Avatar src={doctor.avatar} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: '#1e293b' }}>
                                                        {doctor.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        {doctor.lastSeen}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: '#64748b',
                                                            maxWidth: '180px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {doctor.lastMessage}
                                                    </Typography>
                                                    {doctor.unread > 0 && (
                                                        <Badge 
                                                            badgeContent={doctor.unread} 
                                                            color="primary"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>

                    {/* Chat Area */}
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: selectedDoctor ? 'white' : '#f8fafc'
                    }}>
                        {selectedDoctor ? (
                            <>
                                {/* Chat Header */}
                                <Box sx={{ 
                                    p: 2, 
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                bgcolor: selectedDoctor.online ? '#22c55e' : '#94a3b8'
                                            }
                                        }}
                                    >
                                        <Avatar src={selectedDoctor.avatar} />
                                    </Badge>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#1e293b' }}>
                                            {selectedDoctor.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                                            {selectedDoctor.specialty}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Messages */}
                                <Box sx={{ 
                                    flex: 1, 
                                    p: 3,
                                    overflow: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    bgcolor: '#f8fafc'
                                }}>
                                    {messages.map((msg) => (
                                        <Box
                                            key={msg.id}
                                            sx={{
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%'
                                            }}
                                        >
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    bgcolor: msg.sender === 'user' ? '#3b82f6' : 'white',
                                                    color: msg.sender === 'user' ? 'white' : '#1e293b',
                                                    borderRadius: 3,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <Typography variant="body1">{msg.text}</Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        display: 'block',
                                                        textAlign: 'right',
                                                        mt: 1,
                                                        color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#64748b'
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
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
                                                        disabled={!message.trim()}
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
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#e2e8f0'
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ 
                                flex: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 2,
                                color: '#64748b'
                            }}>
                                <Typography variant="h6">Welcome to HealthHive Chat</Typography>
                                <Typography variant="body1">Select a doctor to start messaging</Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Chat;