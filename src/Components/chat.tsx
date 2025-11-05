import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import StartScreen from './StartScreen';
import ConversationDrawer from './ConversationDrawer';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RenameDialog from './RenameDialog';
import DeleteDialog from './DeleteDialog';
import useLocalStorage from '../hooks/useLocalStorage';
import storageUtils from '../utils/storageUtils';
import { generateGeminiResponse } from '../utils/geminiService';
import { useUser } from '../contexts/UserContext';

type Message = { id: number; author: string; text: string };
type Conversation = { id: string; title: string; messages: Message[]; createdAt: number; updatedAt: number; pinned?: boolean };

const cricketPrompts: string[] = [
  'Latest IPL scores',
  'Top ODI batsmen 2024',
  'Explain the LBW rule in cricket',
  'Who has the most Test wickets?',
  'What is a powerplay?',
  'T20 vs ODI: key differences',
  'Best field placements for swing bowling',
  'What is Duckworth–Lewis–Stern (DLS)?',
  'How to read a scorecard?',
  'Greatest World Cup finals',
  'How does ball tampering work?',
  'Strategies to chase 200 in T20',
];

const Chat: React.FC = () => {
  const { logout } = useUser();
  const backgroundGradient = 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #1f2937 100%)';
  
  // Use custom localStorage hook for automatic persistence
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('chatbot-conversations', [{
    id: 'c-1',
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }]);

  const [selectedId, setSelectedId] = useLocalStorage<string>('chatbot-selectedId', 'c-1');

  const [input, setInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = useMemo(() => conversations.find(c => c.id === selectedId), [conversations, selectedId]);

  // Ensure selectedId is valid - if not found, select the first conversation
  useEffect(() => {
    if (conversations.length > 0 && !conversations.find(c => c.id === selectedId)) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId, setSelectedId]);

  // Generate random suggestions on mount and when conversations change
  useEffect(() => {
    const shuffled = [...cricketPrompts].sort(() => 0.5 - Math.random());
    setSuggestedPrompts(shuffled.slice(0, 3));
  }, [conversations]);

  // Log storage info on mount (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      storageUtils.logStorageInfo();
    }
  }, []);

  const createNewChat = () => {
    const newId = `c-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setSelectedId(newId);
    setDrawerOpen(false);
  };

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setDrawerOpen(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Clear input immediately for better UX
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    setConversations(prev => {
      const next = prev.map(conv => {
        if (conv.id !== selectedId) return conv;
        
        const nextMessages = [...conv.messages, { id: conv.messages.length, author: 'User', text: trimmed }];
        const newTitle = conv.messages.length === 0 ? trimmed.slice(0, 28) || 'New Chat' : conv.title;
        
        return { ...conv, title: newTitle, messages: nextMessages, updatedAt: Date.now() };
      });
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      return next;
    });

    try {
      // Get AI response from Gemini with conversation history
      const conversationHistory = selectedConversation?.messages || [];
      const aiResponse = await generateGeminiResponse(trimmed, conversationHistory);
      
      // Add AI response
      setConversations(prev => {
        const next = prev.map(conv => {
          if (conv.id !== selectedId) return conv;
          
          const finalMessages = [...conv.messages, { id: conv.messages.length, author: 'Assistant', text: aiResponse }];
          return { ...conv, messages: finalMessages, updatedAt: Date.now() };
        });
        next.sort((a, b) => b.updatedAt - a.updatedAt);
        return next;
      });
    } catch (error) {
      // Add error message if AI fails
      setConversations(prev => {
        const next = prev.map(conv => {
          if (conv.id !== selectedId) return conv;
          
          const errorMessage = "I'm sorry, I encountered an error. Please try again.";
          const finalMessages = [...conv.messages, { id: conv.messages.length, author: 'Assistant', text: errorMessage }];
          return { ...conv, messages: finalMessages, updatedAt: Date.now() };
        });
        next.sort((a, b) => b.updatedAt - a.updatedAt);
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePin = (id: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
    ));
  };

  const startRename = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setRenameValue(conv.title);
      setSelectedId(id);
      setRenameOpen(true);
    }
    setDrawerOpen(false);
  };

  const confirmRename = () => {
    if (renameValue.trim()) {
      setConversations(prev => prev.map(conv => 
        conv.id === selectedId ? { ...conv, title: renameValue.trim() } : conv
      ));
    }
    setRenameOpen(false);
    setRenameValue('');
  };

  const deleteConversation = (id: string) => {
    setConversationToDelete(id);
    setDeleteOpen(true);
    setDrawerOpen(false);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      setConversations(prev => {
        const filtered = prev.filter(conv => conv.id !== conversationToDelete);
        if (filtered.length === 0) {
          // If no conversations left, create a new one
          const newId = `c-${Date.now()}`;
          const newConversation: Conversation = {
            id: newId,
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          setSelectedId(newId);
          return [newConversation];
        } else if (conversationToDelete === selectedId) {
          // If deleting current conversation, select the first remaining one
          setSelectedId(filtered[0].id);
        }
        return filtered;
      });
    }
    setDeleteOpen(false);
    setConversationToDelete(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const conversationToDeleteData = conversationToDelete ? conversations.find(c => c.id === conversationToDelete) : null;

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: backgroundGradient,
      overflow: 'hidden',
    }}>
      <AppBar 
        position="fixed"
        sx={{ 
          bgcolor: 'rgba(0,0,0,0.3)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              mr: { xs: 1, sm: 2 }, 
              color: '#e5e7eb',
              p: { xs: 1, sm: 1.5 }
            }}
          >
            <MenuIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#e5e7eb',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: { xs: 500, sm: 600 }
            }}
          >
            Cricket ChatBot
          </Typography>
          <IconButton
            color="inherit"
            onClick={logout}
            sx={{ 
              color: '#e5e7eb',
              p: { xs: 1, sm: 1.5 }
            }}
            title="Logout"
          >
            <LogoutIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <ConversationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        conversations={conversations}
        selectedId={selectedId}
        onSelectConversation={selectConversation}
        onTogglePin={togglePin}
        onStartRename={startRename}
        onDeleteConversation={deleteConversation}
        onCreateNewChat={createNewChat}
      />

      {/* Add top padding to account for fixed header */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        pt: { xs: 7, sm: 8 }, // Adjust based on header height
        height: '100vh',
        overflow: 'hidden',
      }}>
        {selectedConversation?.messages.length === 0 ? (
          <StartScreen
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onSuggestionClick={handleSuggestionClick}
            suggestions={suggestedPrompts}
            isLoading={isLoading}
          />
        ) : (
          <>
            <MessageList messages={selectedConversation?.messages || []} />
            <MessageInput
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </>
        )}
      </Box>

      <RenameDialog
        open={renameOpen}
        currentTitle={selectedConversation?.title || ''}
        onClose={() => setRenameOpen(false)}
        onConfirm={confirmRename}
      />

      <DeleteDialog
        open={deleteOpen}
        conversationTitle={conversationToDeleteData?.title || ''}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default Chat;