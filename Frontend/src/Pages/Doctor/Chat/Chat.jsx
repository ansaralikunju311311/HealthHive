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

const Chat = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data for patients
    const patients = [
        {
            id: 1,
            name: 'John Smith',
            age: 45,
            lastMessage: 'Doctor, I have been taking the medicine as prescribed',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            online: true,
            unread: 3,
            lastSeen: '2 min ago',
            condition: 'Heart Disease'
        },
        {
            id: 2,
            name: 'Emily Johnson',
            age: 32,
            lastMessage: 'Thank you for the consultation',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            online: false,
            unread: 0,
            lastSeen: '1 hour ago',
            condition: 'Diabetes'
        },
        // Add more patients as needed
    ];

    // Dummy messages
    const messages = [
        {
            id: 1,
            sender: 'patient',
            text: 'Hello Doctor, I wanted to ask about my recent test results',
            time: '10:00 AM'
        },
        {
            id: 2,
            sender: 'doctor',
            text: 'Of course, I can help you understand them. Your blood pressure readings are normal now.',
            time: '10:02 AM'
        },
        {
            id: 3,
            sender: 'patient',
            text: 'That\'s great news! Should I continue with the same medication?',
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
            <Sidebar activePage="Chat" />
            
            <Box sx={{ flex: 1, p: 3 }}>
                <Paper sx={{ 
                    display: 'flex', 
                    height: 'calc(100vh - 100px)',
                    overflow: 'hidden',
                    borderRadius: 3,
                    bgcolor: 'white',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                    {/* Patients List */}
                    <Box sx={{ 
                        width: 320, 
                        borderRight: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b', fontWeight: 'bold' }}>
                                Patient Messages
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search patients..."
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
                            {patients.map((patient) => (
                                <React.Fragment key={patient.id}>
                                    <ListItem 
                                        button 
                                        selected={selectedPatient?.id === patient.id}
                                        onClick={() => setSelectedPatient(patient)}
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
                                                        bgcolor: patient.online ? '#22c55e' : '#94a3b8'
                                                    }
                                                }}
                                            >
                                                <Avatar src={patient.avatar} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: '#1e293b' }}>
                                                        {patient.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                        {patient.lastSeen}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: '#64748b',
                                                            maxWidth: '180px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        {patient.lastMessage}
                                                    </Typography>
                                                    <Chip 
                                                        label={patient.condition}
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: '#fee2e2',
                                                            color: '#991b1b',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    />
                                                    {patient.unread > 0 && (
                                                        <Badge 
                                                            badgeContent={patient.unread} 
                                                            color="primary"
                                                            sx={{ 
                                                                float: 'right',
                                                                mt: 1
                                                            }}
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
                        bgcolor: selectedPatient ? 'white' : '#f8fafc'
                    }}>
                        {selectedPatient ? (
                            <>
                                {/* Chat Header */}
                                <Box sx={{ 
                                    p: 2, 
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    bgcolor: selectedPatient.online ? '#22c55e' : '#94a3b8'
                                                }
                                            }}
                                        >
                                            <Avatar src={selectedPatient.avatar} />
                                        </Badge>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#1e293b' }}>
                                                {selectedPatient.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                    Age: {selectedPatient.age}
                                                </Typography>
                                                <Chip 
                                                    label={selectedPatient.condition}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: '#fee2e2',
                                                        color: '#991b1b',
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <IconButton>
                                        <MoreVertIcon sx={{ color: '#64748b' }} />
                                    </IconButton>
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
                                                alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%'
                                            }}
                                        >
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    bgcolor: msg.sender === 'doctor' ? '#3b82f6' : 'white',
                                                    color: msg.sender === 'doctor' ? 'white' : '#1e293b',
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
                                                        color: msg.sender === 'doctor' ? 'rgba(255,255,255,0.8)' : '#64748b'
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
                                <Typography variant="h6">Welcome to Patient Chat</Typography>
                                <Typography variant="body1">Select a patient to start messaging</Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Chat;