import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  onInputChange,
  onSend,
  isLoading = false,
}) => {
  return (
    <Box sx={{ 
      p: { xs: 1.5, sm: 2 }, 
      borderTop: '1px solid rgba(255,255,255,0.1)',
      bgcolor: 'rgba(255,255,255,0.05)',
      position: 'sticky',
      bottom: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
    }}>
      <Box component="form" onSubmit={onSend} sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#e5e7eb',
              height: { xs: '48px', sm: '52px', md: '56px' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: '1px solid rgba(255,255,255,0.3)',
              },
              '& input::placeholder': {
                color: '#e5e7eb',
                opacity: 0.7,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={isLoading || !input.trim()}
          sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            color: '#e5e7eb',
            width: { xs: 48, sm: 52, md: 56 },
            height: { xs: 48, sm: 52, md: 56 },
            borderRadius: '50%',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(255,255,255,0.05)',
              color: 'rgba(229,231,235,0.5)',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: '#e5e7eb' }} />
          ) : (
            <SendIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageInput;
