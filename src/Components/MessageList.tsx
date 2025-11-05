import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: number;
  author: string;
  text: string;
  timestamp?: number;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get the first letter of the user's name
  const getUserInitial = () => {
    return user?.fullName?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <Box sx={{ 
      flex: 1, 
      overflowY: 'auto', 
      overflowX: 'hidden',
      p: { xs: 1.5, sm: 2 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {messages.map((msg, index) => (
        <Box key={msg.id} sx={{ 
          display: 'flex',
          justifyContent: msg.author === 'User' ? 'flex-end' : 'flex-start',
          mb: { xs: 1.5, sm: 2 },
          alignItems: 'flex-start',
          px: { xs: 0.5, sm: 1 }
        }}>
          {msg.author === 'Assistant' && (
            <Avatar sx={{ 
              mr: { xs: 1, sm: 2 },
              bgcolor: '#6b7280',
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}>
              A
            </Avatar>
          )}
          <Box sx={{
            maxWidth: { xs: '75%', sm: '70%', md: '65%' },
            bgcolor: msg.author === 'User' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            p: { xs: 1, sm: 1.5 },
            color: '#e5e7eb',
            ml: msg.author === 'Assistant' ? 0 : 'auto',
            mr: msg.author === 'User' ? 0 : 'auto'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                lineHeight: { xs: 1.4, sm: 1.5 }
              }}
            >
              {msg.text}
            </Typography>
          </Box>
          {msg.author === 'User' && (
            <Avatar sx={{ 
              ml: { xs: 1, sm: 2 },
              bgcolor: '#3b82f6',
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}>
              {getUserInitial()}
            </Avatar>
          )}
        </Box>
      ))}
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
