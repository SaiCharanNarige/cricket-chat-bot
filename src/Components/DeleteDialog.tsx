import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface DeleteDialogProps {
  open: boolean;
  conversationTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  conversationTitle,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#e5e7eb', bgcolor: 'rgba(0,0,0,0.8)' }}>
        Delete Conversation
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'rgba(0,0,0,0.8)' }}>
        <Typography sx={{ color: '#e5e7eb', mt: 1 }}>
          Are you sure you want to delete "{conversationTitle}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'rgba(0,0,0,0.8)' }}>
        <Button onClick={onClose} sx={{ color: '#9ca3af' }}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          sx={{ 
            bgcolor: '#dc2626',
            '&:hover': {
              bgcolor: '#b91c1c',
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
