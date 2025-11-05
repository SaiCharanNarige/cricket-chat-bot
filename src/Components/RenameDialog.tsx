import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface RenameDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  open,
  currentTitle,
  onClose,
  onConfirm,
}) => {
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (open) {
      setNewTitle(currentTitle);
    }
  }, [open, currentTitle]);

  const handleConfirm = () => {
    if (newTitle.trim()) {
      onConfirm(newTitle.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#e5e7eb', bgcolor: 'rgba(0,0,0,0.8)' }}>
        Rename Conversation
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'rgba(0,0,0,0.8)' }}>
        <TextField
          autoFocus
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            mt: 2,
            '& .MuiOutlinedInput-root': {
              color: '#e5e7eb',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255,255,255,0.7)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'rgba(0,0,0,0.8)' }}>
        <Button onClick={onClose} sx={{ color: '#9ca3af' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          sx={{ 
            bgcolor: '#3b82f6',
            '&:hover': {
              bgcolor: '#2563eb',
            },
          }}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
