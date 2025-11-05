import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PushPin,
  Edit,
  Delete,
} from '@mui/icons-material';

interface Conversation {
  id: string;
  title: string;
  messages: Array<{ id: number; author: string; text: string; timestamp?: number }>;
  updatedAt: number;
  pinned?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelectConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onStartRename: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
  onTogglePin,
  onStartRename,
  onDeleteConversation,
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const sortedConversations = [...conversations].sort((a, b) => {
    if ((a.pinned ?? false) !== (b.pinned ?? false)) return (a.pinned ?? false) ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <Box sx={{ flex: 1, overflowY: 'auto' }}>
      <List sx={{ p: 0 }}>
        {sortedConversations.map((conversation) => (
          <ListItemButton
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            selected={conversation.id === selectedId}
            sx={{
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '&.Mui-selected': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    color: '#e5e7eb',
                    fontWeight: conversation.id === selectedId ? 600 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conversation.title}
                  </span>
                  {conversation.pinned === true && (
                    <PushPin sx={{ color: '#e5e7eb', fontSize: 16, flexShrink: 0 }} />
                  )}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  sx={{
                    color: '#9ca3af',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {formatTime(conversation.updatedAt)}
                  </span>
                  <span style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                        <Tooltip title={(conversation.pinned ?? false) ? "Unpin" : "Pin"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(conversation.id);
                        }}
                        sx={{ color: '#e5e7eb', p: 0.25 }}
                      >
                        <PushPin sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rename">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartRename(conversation.id);
                        }}
                        sx={{ color: '#e5e7eb', p: 0.25 }}
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        sx={{ color: '#e5e7eb', p: 0.25 }}
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </span>
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ConversationList;
