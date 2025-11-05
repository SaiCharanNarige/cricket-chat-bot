import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useUser } from '../contexts/UserContext';

interface StartScreenProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: string[];
  isLoading?: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({
  input,
  onInputChange,
  onSend,
  onSuggestionClick,
  suggestions,
  isLoading = false,
}) => {
  const { user } = useUser();
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3, md: 4 },
      overflow: 'hidden',
    }}>
      {/* Spacer to push content to bottom */}
      <Box sx={{ flex: 1 }} />

      {/* Bottom section with welcome, title, chips and input */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: { xs: 2, sm: 3, md: 3 }
      }}>
        {/* Welcome message */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 500,
            color: '#9ca3af',
            textAlign: 'center',
            fontSize: { 
              xs: '1.125rem', 
              sm: '1.25rem', 
              md: '1.5rem'
            },
            mb: 1,
          }}
        >
          Welcome, {user?.fullName}! 👋
        </Typography>

        {/* Title right above chips */}
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#e5e7eb',
            textAlign: 'center',
            fontSize: { 
              xs: '1.75rem', 
              sm: '2.25rem', 
              md: '2.75rem',
              lg: '3.25rem'
            },
            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
            px: { xs: 1, sm: 2 }
          }}
        >
          Learn More About Cricket?
        </Typography>

        {/* Suggestion chips */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 1.5, md: 2 }} 
          sx={{ 
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100%'
          }}
        >
          {suggestions.map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                height: { xs: 32, sm: 36, md: 40 },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                },
                cursor: 'pointer',
                maxWidth: { xs: '250px', sm: '250px', md: '300px' }
              }}
            />
          ))}
        </Stack>
        
        {/* Input field */}
        <Box 
          component="form" 
          onSubmit={onSend} 
          sx={{ 
            width: '80%',
            position: 'sticky',
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask anything..."
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
            InputProps={{
              endAdornment: (
                <IconButton
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  sx={{
                    bgcolor: 'transparent',
                    color: '#e5e7eb',
                    width: { xs: 48, sm: 52, md: 56 },
                    height: { xs: 48, sm: 52, md: 56 },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(229,231,235,0.5)',
                    },
                    mr: { xs: 0.5, sm: 0.5 }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: '#e5e7eb' }} />
                  ) : (
                    <SendIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }} />
                  )}
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StartScreen;
