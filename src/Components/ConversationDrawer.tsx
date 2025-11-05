import React from 'react';
import {
  Drawer,
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import ConversationList from './ConversationList';

interface Conversation {
  id: string;
  title: string;
  messages: Array<{ id: number; author: string; text: string; timestamp?: number }>;
  updatedAt: number;
  pinned?: boolean;
}

interface ConversationDrawerProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  selectedId: string;
  onSelectConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onStartRename: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onCreateNewChat: () => void;
}

const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  open,
  onClose,
  conversations,
  selectedId,
  onSelectConversation,
  onTogglePin,
  onStartRename,
  onDeleteConversation,
  onCreateNewChat,
}) => {
  const drawerContent = (
    <Box sx={{ 
      width: { xs: 280, sm: 300, md: 320 }, 
      height: '100%', 
      bgcolor: 'rgba(0,0,0,0.8)', 
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#e5e7eb', 
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
          }}
        >
          History
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: '#e5e7eb',
            p: { xs: 0.5, sm: 1 }
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>
      </Box>
      
      {/* New Chat Button */}
      <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }} />}
          onClick={onCreateNewChat}
          sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            color: '#e5e7eb',
            borderRadius: '8px',
            textTransform: 'none',
            py: { xs: 1, sm: 1.5 },
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          New Chat
        </Button>
      </Box>
      
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelectConversation={onSelectConversation}
        onTogglePin={onTogglePin}
        onStartRename={onStartRename}
        onDeleteConversation={onDeleteConversation}
      />
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile SwipeableDrawer */}
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </SwipeableDrawer>
    </>
  );
};

export default ConversationDrawer;
