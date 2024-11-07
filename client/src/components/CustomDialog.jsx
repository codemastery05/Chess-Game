import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import React, { useEffect } from 'react';

export default function CustomDialog({ open, children, title, contentText, handleContinue, handleClose }) {
  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === 'Enter') {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleEnterKey);
    return () => {
      window.removeEventListener('keydown', handleEnterKey);
    };
  }, [handleContinue]);

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent> 
        <DialogContentText>
          {contentText}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions> 
        {handleClose && <Button onClick={handleClose}>Cancel</Button>}
        <Button onClick={handleContinue}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}
